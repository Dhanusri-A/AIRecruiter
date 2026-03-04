from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.v1.deps import get_current_user, require_role
from app.db.base import get_db
from app.db.crud.candidate_profile import CandidateProfileCRUD
from app.db.crud.education import  EducationCRUD
from app.schemas.education import EducationCreate, EducationUpdate, EducationResponse


router = APIRouter(
    prefix="/candidates",
    tags=["candidate-education"],
    # dependencies=[Depends(get_current_user)],
)


@router.post("/{candidate_id}/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def create_education(
    candidate_id: str,
    education_data: EducationCreate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),

):
    """Create a new education record for a candidate."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    try:
        db_education = EducationCRUD.create_education(db, candidate_id, education_data.model_dump(exclude_unset=True))
        return db_education
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create education record: {str(e)}"
        )


@router.get("/{candidate_id}/education", response_model=list[EducationResponse])
def get_educations(
    candidate_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Get all education records for a candidate."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    educations = EducationCRUD.get_educations_by_candidate(db, candidate_id, skip=skip, limit=limit)
    return educations


@router.put("/{candidate_id}/education/{education_id}", response_model=EducationResponse)
def update_education(
    candidate_id: str,
    education_id: str,
    education_data: EducationUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Update an education record by ID."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    # Verify education belongs to candidate
    db_education = EducationCRUD.get_education_by_id(db, education_id)
    if not db_education or db_education.candidate_profile_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Education record with ID {education_id} not found for this candidate"
        )

    update_data = education_data.model_dump(exclude_unset=True)
    db_education = EducationCRUD.update_education(db, education_id, update_data)
    return db_education


@router.delete("/{candidate_id}/education/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    candidate_id: str,
    education_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    """Delete an education record by ID."""
    # Verify candidate exists
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found"
        )

    # Verify education belongs to candidate
    db_education = EducationCRUD.get_education_by_id(db, education_id)
    if not db_education or db_education.candidate_profile_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Education record with ID {education_id} not found for this candidate"
        )

    success = EducationCRUD.delete_education(db, education_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Failed to delete education record"
        )
    return None
