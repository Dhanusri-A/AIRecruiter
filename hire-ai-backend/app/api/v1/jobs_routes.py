from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.v1.deps import get_current_user, require_role
from app.db.base import get_db
from app.db.crud import JobDescriptionCRUD
from app.db.models import User
from app.schemas.job import JobDescriptionCreate, JobDescriptionUpdate, JobDescriptionResponse
from app.services.job_generator import job_generator

router = APIRouter(
    prefix="/jobs",
    tags=["jobs"],
    # dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_data: JobDescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user = Depends(require_role("admin","recruiter")),
):
    """Create a new job description."""
    content = job_generator.generate_job_description(job_data)
    try:
        db_job = JobDescriptionCRUD.create_job(db, job_data,content,current_user.id)
        return db_job
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create job: {str(e)}"
        )


# @router.post("/generate", response_model=JobDescriptionResponse)
# def generate_job(
#     payload: JobDescriptionCreate,
#     db: Session = Depends(get_db),
# ):
#     content = job_generator.generate_job_description(payload)
#     try:
#         job = JobDescriptionCRUD.create_job(
#             db,
#             payload,
#             generated_description=content,
#         )    
#         return job
#     except Exception as e:
#             raise HTTPException(
#                 status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#                 detail=f"Failed to create job: {str(e)}"
#             )



@router.get("", response_model=list[JobDescriptionResponse])
def get_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin")),
):
    """Get all job descriptions with pagination."""
    jobs = JobDescriptionCRUD.get_all_jobs(db, skip=skip, limit=limit)
    return jobs


@router.get("/{job_id}", response_model=JobDescriptionResponse)
def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Get a specific job description by ID."""
    db_job = JobDescriptionCRUD.get_job_by_id(db, job_id)
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    return db_job


@router.get("/users/{user_id}", response_model=list[JobDescriptionResponse])
def get_job_by_user(
    user_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    """Get a specific job description by User ID."""
    db_job = JobDescriptionCRUD.get_user_jobs(db, user_id)
    print(db_job)
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with User ID {user_id} not found"
        )
    return db_job



@router.put("/{job_id}", response_model=JobDescriptionResponse)
def update_and_regenerate_job(
    job_id: str,
    job_data: JobDescriptionUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    db_job = JobDescriptionCRUD.get_job_by_id(db, job_id)
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found",
        )

    # 1️⃣ Build full payload from existing job
    base_payload = {
        "job_title": db_job.job_title,
        "company_name": db_job.company_name,
        "department": db_job.department,
        "location": db_job.location,
        "level": db_job.level,
        "tone_style": db_job.tone_style,
        "skills": db_job.skills,
        "responsibilities": db_job.responsibilities,
        "additional_data": db_job.additional_data,
        "input_description": db_job.input_description,
    }

    # 2️⃣ Overlay updated fields
    update_payload = job_data.model_dump(exclude_unset=True)
    base_payload.update(update_payload)

    # 3️⃣ Regenerate output
    generated_output = job_generator.generate_job_description(
        JobDescriptionCreate(**base_payload)
    )

    # 4️⃣ Persist everything in SAME ROW
    base_payload["output_description"] = generated_output

    updated_job = JobDescriptionCRUD.update_job(
        db=db,
        job_id=job_id,
        job_data=base_payload,
    )

    return updated_job




@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    """Delete a job description by ID."""
    success = JobDescriptionCRUD.delete_job(db, job_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    return None
