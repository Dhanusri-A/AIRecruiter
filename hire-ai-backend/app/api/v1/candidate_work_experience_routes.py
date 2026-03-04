from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.v1.deps import get_current_user, require_role
from app.db.base import get_db
from app.db.crud.candidate_profile import CandidateProfileCRUD
from app.db.crud.work_experience import  WorkExperienceCRUD
from app.schemas.work_experience import WorkExperienceCreate, WorkExperienceUpdate, WorkExperienceResponse


router = APIRouter(
    prefix="/candidates",
    tags=["candidate-work-experience"],
    # dependencies=[Depends(get_current_user)],
)


@router.post("/{candidate_id}/work-experience", response_model=WorkExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_work_experience(
    candidate_id: str,
    experience_data: WorkExperienceCreate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),

):
    """Create a new work experience record for a candidate."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    try:
        db_experience = WorkExperienceCRUD.create_work_experience(db, candidate_id, experience_data.model_dump(exclude_unset=True))
        return db_experience
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create work experience record: {str(e)}"
        )


@router.get("/{candidate_id}/work-experience", response_model=list[WorkExperienceResponse])
def get_work_experiences(
    candidate_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Get all work experience records for a candidate."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    experiences = WorkExperienceCRUD.get_work_experiences_by_candidate(db, candidate_id, skip=skip, limit=limit)
    return experiences


@router.put("/{candidate_id}/work-experience/{experience_id}", response_model=WorkExperienceResponse)
def update_work_experience(
    candidate_id: str,
    experience_id: str,
    experience_data: WorkExperienceUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Update a work experience record by ID."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    # Verify work experience belongs to candidate
    db_experience = WorkExperienceCRUD.get_work_experience_by_id(db, experience_id)
    if not db_experience or db_experience.candidate_profile_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work experience record with ID {experience_id} not found for this candidate"
        )

    update_data = experience_data.model_dump(exclude_unset=True)
    db_experience = WorkExperienceCRUD.update_work_experience(db, experience_id, update_data)
    return db_experience


@router.delete("/{candidate_id}/work-experience/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_work_experience(
    candidate_id: str,
    experience_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Delete a work experience record by ID."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    # Verify work experience belongs to candidate
    db_experience = WorkExperienceCRUD.get_work_experience_by_id(db, experience_id)
    if not db_experience or db_experience.candidate_profile_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work experience record with ID {experience_id} not found for this candidate"
        )

    success = WorkExperienceCRUD.delete_work_experience(db, experience_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Failed to delete work experience record"
        )
    return None
