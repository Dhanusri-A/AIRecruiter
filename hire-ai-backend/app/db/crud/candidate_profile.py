from typing import Optional
from sqlalchemy.orm import Session, joinedload

from app.db.models.candidate_profile import CandidateProfile

from sqlalchemy import func
from app.db.models.candidate_status import CandidateStatus


class CandidateProfileCRUD:
    """CRUD operations for CandidateProfile model."""

    @staticmethod
    def create_candidate_profile(
        db: Session,
        user_id: str,
        recruiter_id: str,
        profile_data: dict,
    ) -> CandidateProfile:
        db_profile = CandidateProfile(
            user_id=user_id,
            recruiter_id=recruiter_id,
            **profile_data,
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile

    @staticmethod
    def get_profile_by_id(db: Session, profile_id: str) -> Optional[CandidateProfile]:
        """Get candidate profile by ID with related data."""
        return (
            db.query(CandidateProfile)
            .options(
                joinedload(CandidateProfile.user),
                joinedload(CandidateProfile.education_records),
                joinedload(CandidateProfile.work_experiences),
                joinedload(CandidateProfile.certifications),
            )
            .filter(CandidateProfile.id == profile_id)
            .first()
        )


    @staticmethod
    def get_profile_by_user_id(db: Session, user_id: str) -> Optional[CandidateProfile]:
        """Get candidate profile by user ID with related data."""
        return (
            db.query(CandidateProfile)
            .options(
                joinedload(CandidateProfile.user),
                joinedload(CandidateProfile.education_records),
                joinedload(CandidateProfile.work_experiences),
                joinedload(CandidateProfile.certifications),
            )
            .filter(CandidateProfile.user_id == user_id)
            .first()
        )

    @staticmethod
    def get_all_profiles(db: Session, skip: int = 0, limit: int = 100) -> list[CandidateProfile]:
        """Get all candidate profiles with pagination."""
        return (db.query(CandidateProfile)
            .options(
                joinedload(CandidateProfile.user),
                joinedload(CandidateProfile.education_records),
                joinedload(CandidateProfile.work_experiences),
                joinedload(CandidateProfile.certifications)
            )
            .offset(skip).limit(limit).all()
        )


    @staticmethod
    def get_all_profiles_by_recruiter(
        db: Session,
        recruiter_id: str,
        skip: int = 0,
        limit: int = 100,
    ) -> list[CandidateProfile]:
        """Get all candidate profiles for a specific recruiter."""
        return (
            db.query(CandidateProfile)
            .filter(CandidateProfile.recruiter_id == recruiter_id)
            .options(
                joinedload(CandidateProfile.user),
                joinedload(CandidateProfile.education_records),
                joinedload(CandidateProfile.work_experiences),
                joinedload(CandidateProfile.certifications),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )


    @staticmethod
    def get_candidate_status_counts_by_recruiter(
        db: Session,
        recruiter_id: str,
    ) -> dict[str, int]:
        rows = (
            db.query(
                CandidateProfile.status,
                    func.count(CandidateProfile.id)
            )
            .filter(CandidateProfile.recruiter_id == recruiter_id)
            .group_by(CandidateProfile.status)
                .all()
        )
        result = {status.value: 0 for status in CandidateStatus}
        for status, count in rows:
                result[status.value] = count
        return result

    @staticmethod
    def update_profile(db: Session, profile_id: str, profile_data: dict) -> Optional[CandidateProfile]:
        """Update candidate profile by ID."""
        db_profile = CandidateProfileCRUD.get_profile_by_id(db, profile_id)
        if not db_profile:
            return None

        for key, value in profile_data.items():
            if value is not None:
                setattr(db_profile, key, value)

        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile

    @staticmethod
    def delete_profile(db: Session, profile_id: str) -> bool:
        """Delete candidate profile by ID."""
        db_profile = CandidateProfileCRUD.get_profile_by_id(db, profile_id)
        if not db_profile:
            return False

        db.delete(db_profile)
        db.commit()
        return True
