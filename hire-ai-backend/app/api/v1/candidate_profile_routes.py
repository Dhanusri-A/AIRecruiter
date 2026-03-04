from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.v1.deps import get_current_user, require_role
from app.db.base import get_db
from app.db.crud.user import UserCRUD
from app.db.crud.interview import InterviewCRUD
from app.db.crud.candidate_profile import  CandidateProfileCRUD
from app.schemas.candidate_profile import (
    CandidateCreateRequest,
    CandidateCreateResponse,
    CandidateProfileCreate,
    CandidateProfileUpdate,
    CandidateProfileResponse,
    CandidateProfileDetailResponse,
    SearchRequest,
    SearchResult
)
from app.schemas.user import UserCreate
from app.db.models.user_role import UserRole
from app.db.models.candidate_status import CandidateStatus
from app.services.ask_ai import ask_ai
from app.services import source_candidate


router = APIRouter(
    prefix="/candidates",
    tags=["candidates"],
    # dependencies=[Depends(get_current_user)],
)




@router.post("/search", response_model=List[SearchResult])
async def get_profiles(request: SearchRequest):
    try:
        results = await source_candidate.search_google_profiles(
            request.job_title, 
            request.location, 
            request.source
        )
        if not results:
            return []
        return source_candidate.parse_people_from_search(results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=CandidateCreateResponse, status_code=status.HTTP_201_CREATED)
def create_candidate(
    candidate_data: CandidateCreateRequest,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter"))
):
    """Create a new candidate (user with candidate role and profile)."""
    try:
        # Create user
        existing_user = UserCRUD.get_user_by_email(db, candidate_data.email)

        if existing_user:
            db_user = existing_user
        else:
            user_create = UserCreate(
                email=candidate_data.email,
                username=f"{candidate_data.first_name}.{candidate_data.last_name}.{uuid.uuid4().hex[:6]}",
                password=uuid.uuid4().hex[:8],
                role=UserRole.CANDIDATE,
            )
            db_user = UserCRUD.create_user(db, user_create)

        # Create candidate profile with provided data
        profile_dict = {
            "first_name": candidate_data.first_name,
            "last_name": candidate_data.last_name,
            "title": candidate_data.title,
            "image_url": candidate_data.image_url,
            "phone": candidate_data.phone,
            "location": candidate_data.location,
            "skills": candidate_data.skills,
            "profile_summary": candidate_data.profile_summary,
            "total_years_experience": candidate_data.total_years_experience,
            "notice_period": candidate_data.notice_period,
            "expected_salary": candidate_data.expected_salary,
            "preferred_mode": candidate_data.preferred_mode,
            "languages": candidate_data.languages,
            "profiles": candidate_data.profiles,
            "status": CandidateStatus.SOURCED,  
        }
        # Remove None values
        profile_dict = {k: v for k, v in profile_dict.items() if v is not None}
        db_profile = CandidateProfileCRUD.create_candidate_profile(
            db,
            user_id=db_user.id,
            recruiter_id=user.id,
            profile_data=profile_dict,
        )

        return {
            "user": db_user,
            "profile": db_profile,
            "education_records": [],
            "work_experiences": [],
            "certifications": [],
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create candidate: {str(e)}"
        )


@router.get("", response_model=list[CandidateProfileDetailResponse])
def get_candidates(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):
    """Get all candidates with pagination."""
    candidates = CandidateProfileCRUD.get_all_profiles(db, skip=skip, limit=limit)
    return candidates


@router.get("/recruiter/{recruiter_id}", response_model=list[CandidateProfileDetailResponse])
def get_candidates_by_recruiter(
    recruiter_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin", "recruiter")),
):
    
    if user.role == UserRole.RECRUITER and user.id != recruiter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own candidates",
        )

    """Get all candidates assigned to a recruiter with pagination."""
    candidates = CandidateProfileCRUD.get_all_profiles_by_recruiter(
        db,
        recruiter_id=recruiter_id,
        skip=skip,
        limit=limit,
    )
    return candidates   


@router.get("/recruiter/{recruiter_id}/count")
def get_candidates_count_by_recruiter(
    recruiter_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin", "recruiter")),
):
    candidates = CandidateProfileCRUD.get_all_profiles_by_recruiter(
        db,
        recruiter_id=recruiter_id,
    )
    count_db = CandidateProfileCRUD.get_candidate_status_counts_by_recruiter(
        db=db,
        recruiter_id=recruiter_id,
    )
    interviews = InterviewCRUD.get_by_recruiter_id(db, recruiter_id)
    return {
        "candidates":len(candidates),
        "interviews":len(interviews),
        "status":count_db
    }



@router.get("/{candidate_id}", response_model=CandidateProfileDetailResponse)
def get_candidate(
    candidate_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter"))
):
    """Get a specific candidate profile with education and work experience."""
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )
    return db_candidate


@router.put("/{candidate_id}", response_model=CandidateProfileResponse)
def update_candidate(
    candidate_id: str,
    profile_data: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter"))
):
    """Update a candidate profile by ID."""
    update_data = profile_data.model_dump(exclude_unset=True)
    db_candidate = CandidateProfileCRUD.update_profile(db, candidate_id, update_data)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )
    return db_candidate


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter"))
):
    """Delete a candidate profile by ID."""
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    # Soft delete the associated user
    success = CandidateProfileCRUD.delete_profile(db, db_candidate.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete candidate"
        )
    return None

