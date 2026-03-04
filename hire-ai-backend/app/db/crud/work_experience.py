from typing import Optional
from sqlalchemy.orm import Session

from app.db.models.work_experience import WorkExperience


class WorkExperienceCRUD:
    """CRUD operations for WorkExperience model."""

    @staticmethod
    def create_work_experience(db: Session, candidate_profile_id: str, experience_data: dict) -> WorkExperience:
        """Create a new work experience record."""
        db_experience = WorkExperience(candidate_profile_id=candidate_profile_id, **experience_data)
        db.add(db_experience)
        db.commit()
        db.refresh(db_experience)
        return db_experience

    @staticmethod
    def get_work_experience_by_id(db: Session, experience_id: str) -> Optional[WorkExperience]:
        """Get work experience record by ID."""
        return db.query(WorkExperience).filter(WorkExperience.id == experience_id).first()

    @staticmethod
    def get_work_experiences_by_candidate(db: Session, candidate_profile_id: str, skip: int = 0, limit: int = 100) -> list[WorkExperience]:
        """Get all work experience records for a candidate."""
        return db.query(WorkExperience).filter(WorkExperience.candidate_profile_id == candidate_profile_id).offset(skip).limit(limit).all()

    @staticmethod
    def update_work_experience(db: Session, experience_id: str, experience_data: dict) -> Optional[WorkExperience]:
        """Update work experience record by ID."""
        db_experience = WorkExperienceCRUD.get_work_experience_by_id(db, experience_id)
        if not db_experience:
            return None

        for key, value in experience_data.items():
            if value is not None:
                setattr(db_experience, key, value)

        db.add(db_experience)
        db.commit()
        db.refresh(db_experience)
        return db_experience

    @staticmethod
    def delete_work_experience(db: Session, experience_id: str) -> bool:
        """Delete work experience record by ID."""
        db_experience = WorkExperienceCRUD.get_work_experience_by_id(db, experience_id)
        if not db_experience:
            return False

        db.delete(db_experience)
        db.commit()
        return True
