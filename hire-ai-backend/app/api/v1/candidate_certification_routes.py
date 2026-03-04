from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.v1.deps import get_current_user, require_role
from app.db.base import get_db
from app.db.crud.candidate_profile import CandidateProfileCRUD
from app.db.crud.certification import  CertificationCRUD
from app.schemas.certification import CertificationCreate, CertificationUpdate, CertificationResponse


router = APIRouter(
    prefix="/candidates",
    tags=["candidate-certifications"],
    # dependencies=[Depends(get_current_user)],
)


@router.post(
    "/{candidate_id}/certifications",
    response_model=CertificationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certification(
    candidate_id: str,
    certification_data: CertificationCreate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found",
        )

    try:
        return CertificationCRUD.create_certification(
            db,
            candidate_id,
            certification_data.model_dump(exclude_unset=True),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create certification: {str(e)}",
        )


@router.get(
    "/{candidate_id}/certifications",
    response_model=list[CertificationResponse],
)
def get_certifications(
    candidate_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found",
        )

    return CertificationCRUD.get_certifications_by_candidate(
        db, candidate_id, skip=skip, limit=limit
    )


@router.put(
    "/{candidate_id}/certifications/{certification_id}",
    response_model=CertificationResponse,
)
def update_certification(
    candidate_id: str,
    certification_id: str,
    certification_data: CertificationUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found",
        )

    db_cert = CertificationCRUD.get_certification_by_id(db, certification_id)
    if not db_cert or db_cert.candidate_profile_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certification record not found for this candidate",
        )

    return CertificationCRUD.update_certification(
        db,
        certification_id,
        certification_data.model_dump(exclude_unset=True),
    )


@router.delete(
    "/{candidate_id}/certifications/{certification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_certification(
    candidate_id: str,
    certification_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter","candidate")),
):
    db_candidate = CandidateProfileCRUD.get_profile_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found",
        )

    db_cert = CertificationCRUD.get_certification_by_id(db, certification_id)
    if not db_cert or db_cert.candidate_profile_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certification record not found for this candidate",
        )

    CertificationCRUD.delete_certification(db, certification_id)
    return None
