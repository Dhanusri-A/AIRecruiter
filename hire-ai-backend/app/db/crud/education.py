from typing import Optional
from sqlalchemy.orm import Session

from app.db.models.education import Education


class EducationCRUD:
    """CRUD operations for Education model."""

    @staticmethod
    def create_education(db: Session, candidate_profile_id: str, education_data: dict) -> Education:
        """Create a new education record."""
        db_education = Education(candidate_profile_id=candidate_profile_id, **education_data)
        db.add(db_education)
        db.commit()
        db.refresh(db_education)
        return db_education

    @staticmethod
    def get_education_by_id(db: Session, education_id: str) -> Optional[Education]:
        """Get education record by ID."""
        return db.query(Education).filter(Education.id == education_id).first()

    @staticmethod
    def get_educations_by_candidate(db: Session, candidate_profile_id: str, skip: int = 0, limit: int = 100) -> list[Education]:
        """Get all education records for a candidate."""
        return db.query(Education).filter(Education.candidate_profile_id == candidate_profile_id).offset(skip).limit(limit).all()

    @staticmethod
    def update_education(db: Session, education_id: str, education_data: dict) -> Optional[Education]:
        """Update education record by ID."""
        db_education = EducationCRUD.get_education_by_id(db, education_id)
        if not db_education:
            return None

        for key, value in education_data.items():
            if value is not None:
                setattr(db_education, key, value)

        db.add(db_education)
        db.commit()
        db.refresh(db_education)
        return db_education

    @staticmethod
    def delete_education(db: Session, education_id: str) -> bool:
        """Delete education record by ID."""
        db_education = EducationCRUD.get_education_by_id(db, education_id)
        if not db_education:
            return False

        db.delete(db_education)
        db.commit()
        return True
