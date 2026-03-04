from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi import UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_role
from app.db.base import get_db
from app.db.crud.interview import InterviewCRUD
from app.db.crud.interview_recording import InterviewRecordingCRUD
from app.db.crud.user import UserCRUD
from app.db.models.user import User
from app.db.models.user_role import UserRole
from app.schemas.interview import CompleteInterviewRecordingRequest, InterviewCreate, InterviewUpdate, InterviewResponse, InterviewVideoResponse, PresignedUrlRequest, PresignedUrlResponse

from app.services.ai_interview import generate_questions, evaluate_answers, validate_interview_time
from app.services.email_sender import send_interview_completed_email
from app.schemas.interview import InterviewQARequest

from datetime import datetime, timedelta
import uuid


# FOR AWS S3
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from app.core.config import AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
    endpoint_url=f"https://s3.{AWS_REGION}.amazonaws.com",  # ← ADD THIS
    config=Config(signature_version="s3v4"),  
)


router = APIRouter(
    prefix="/interviews",
    tags=["interviews"],
    dependencies=[Depends(get_current_user)],
)



# ── POST /interviews ────────────────────────────────────────────────────────────

@router.post("", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def create_interview(
    interview_data: InterviewCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin","recruiter")),

):
    """Schedule a new interview. Only recruiters can create interviews."""

    try:
        db_interview = InterviewCRUD.create_interview(
            db, interview_data, recruiter_id=current_user.id, background_tasks=background_tasks,
        )
        return db_interview
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create interview: {str(e)}",
        )


# ── GET /interviews ─────────────────────────────────────────────────────────────

@router.get("", response_model=list[InterviewResponse])
def get_all_interviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin")),
):
    """Get all interviews with pagination."""
    return InterviewCRUD.get_all_interviews(db, skip=skip, limit=limit)


# ── GET /interviews/{interview_id} ──────────────────────────────────────────────

@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Get a specific interview by ID."""
    db_interview = InterviewCRUD.get_interview_by_id(db, interview_id)
    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview with ID {interview_id} not found",
        )
    return db_interview


# ── GET /interviews/candidate/{candidate_id} ────────────────────────────────────

@router.get("/candidate/{candidate_id}", response_model=list[InterviewResponse])
def get_interviews_by_candidate(
    candidate_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","candidate")),
):
    """Get all interviews for a specific candidate."""
    interviews = InterviewCRUD.get_by_candidate_id(db, candidate_id, skip=skip, limit=limit)
    if not interviews:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No interviews found for candidate ID {candidate_id}",
        )
    return interviews


# ── GET /interviews/recruiter/{recruiter_id} ────────────────────────────────────

@router.get("/recruiter/{recruiter_id}", response_model=list[InterviewResponse])
def get_interviews_by_recruiter(
    recruiter_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    """Get all interviews created by a specific recruiter."""
    interviews = InterviewCRUD.get_by_recruiter_id(db, recruiter_id, skip=skip, limit=limit)
    if not interviews:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No interviews found for recruiter ID {recruiter_id}",
        )
    return interviews


# ── PUT /interviews/{interview_id} ──────────────────────────────────────────────

@router.put("/{interview_id}", response_model=InterviewResponse)
def update_interview(
    interview_id: str,
    interview_data: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin","recruiter")),
):
    """Update an interview. Only the recruiter who created it can update it."""

    db_interview = InterviewCRUD.get_interview_by_id(db, interview_id)
    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview with ID {interview_id} not found",
        )

    if db_interview.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update interviews you created.",
        )

    update_payload = interview_data.model_dump(exclude_unset=True)
    updated = InterviewCRUD.update_interview(db, interview_id, update_payload)
    return updated


# ── DELETE /interviews/{interview_id} ───────────────────────────────────────────

@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin","recruiter")),
):
    """Delete an interview. Only the recruiter who created it can delete it."""

    db_interview = InterviewCRUD.get_interview_by_id(db, interview_id)
    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview with ID {interview_id} not found",
        )

    if db_interview.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete interviews you created.",
        )

    InterviewCRUD.delete_interview(db, interview_id)
    return None


# ----------------- AI Interview Routes -----------------

@router.get("/{interview_id}/questions")
def get_interview_questions(
    interview_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","candidate")),
):
    db_interview = InterviewCRUD.get_interview_by_id(db, interview_id)

    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )
    
    # try:
    #     validate_interview_time(db_interview)
    # except ValueError as e:
    #     raise HTTPException(status_code=403, detail=str(e))

    ai_response = generate_questions(db_interview.job_title)
    return ai_response



@router.post("/{interview_id}/evaluate")
def evaluate_interview(
    interview_id: str,
    payload: InterviewQARequest,
    background_tasks:BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin","candidate")),
):
    
    db_interview = InterviewCRUD.get_interview_by_id(db, interview_id)

    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    if db_interview.scores is not None:
        raise HTTPException(status_code=400, detail="Interview already evaluated")
    
    ai_result = evaluate_answers(
        job_title=db_interview.job_title,
        qa=[qa.model_dump() for qa in payload.qa],
    )

    InterviewCRUD.update_interview(
        db,
        interview_id,
        {
            "qa": [qa.model_dump() for qa in payload.qa],
            "scores": ai_result["score"],
            "ai_summary": ai_result["ai_summary"],
        },
    )
    recruiter_db = UserCRUD.get_user_by_id(db,db_interview.recruiter_id)
    background_tasks.add_task(
        send_interview_completed_email,
        interview_db={
            "candidate_name": db_interview.candidate_name,
            "candidate_email": db_interview.candidate_email,
            "job_title": db_interview.job_title,
            "date": db_interview.date,
            "time": db_interview.time,
        },
        email_to=recruiter_db.email,
    )

    return {"status": "success"}




@router.post(
    "/{interview_id}/recording-presigned-url",
    response_model=PresignedUrlResponse,
)
async def generate_presigned_url_for_recording(
    interview_id: str,
    req: PresignedUrlRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin", "candidate")),
):
    interview = InterviewCRUD.get_interview_by_id(db, interview_id)

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if user.role == UserRole.CANDIDATE and interview.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your interview")

    object_key = (
        f"recordings/{interview_id}/"
        f"q{req.question_index:02d}/"
        f"{uuid.uuid4()}.webm"
    )

    # ✅ DO NOT include ContentType in Params.
    # If you sign ContentType, S3 requires the PUT to send that exact header,
    # which triggers a CORS preflight that S3 rejects for presigned URLs.
    presigned_url = s3_client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": S3_BUCKET_NAME,
            "Key": object_key,
            # "ContentType": req.content_type,  ← REMOVED
        },
        ExpiresIn=600,
    )

    return PresignedUrlResponse(
        presigned_url=presigned_url,
        object_key=object_key,
    )



@router.post("/{interview_id}/questions/{question_index}/complete")
async def complete_question_recording(
    interview_id: str,
    question_index: int,
    req: CompleteInterviewRecordingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin", "candidate")),
):
    interview = InterviewCRUD.get_interview_by_id(db, interview_id)

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if user.role == UserRole.CANDIDATE and interview.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your interview")

    InterviewRecordingCRUD.upsert(
        db=db,
        interview_id=interview_id,
        question_index=question_index,
        s3_object_key=req.object_key,
    )

    return {"status": "completed"}


@router.get("/{interview_id}/recordings")
async def get_all_recordings_for_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin", "recruiter")),
):
    return InterviewRecordingCRUD.get_all_by_interview(db, interview_id)


@router.get(
    "/{interview_id}/questions/{question_index}/video",
    response_model=InterviewVideoResponse,
)
async def get_question_video(
    interview_id: str,
    question_index: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin", "candidate", "recruiter")),
):
    interview = InterviewCRUD.get_interview_by_id(db, interview_id)

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if user.role == UserRole.CANDIDATE and interview.candidate_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your interview")

    if user.role == UserRole.RECRUITER and interview.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your interview")

    recording = InterviewRecordingCRUD.get_by_interview_and_question(
        db, interview_id, question_index
    )

    if not recording:
        raise HTTPException(status_code=404, detail="Video not found")

    presigned_url = s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": S3_BUCKET_NAME,
            "Key": recording.s3_object_key,
        },
        ExpiresIn=300,
    )

    return {"video_url": presigned_url}