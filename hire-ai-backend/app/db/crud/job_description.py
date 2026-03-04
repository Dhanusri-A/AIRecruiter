from typing import Optional
from sqlalchemy.orm import Session

from app.db.models.job_description import JobDescription
from app.schemas.job import JobDescriptionCreate


class JobDescriptionCRUD:
    """CRUD operations for JobDescription model."""

    @staticmethod
    def create_job(db: Session, job_data: JobDescriptionCreate, generated_description: dict, user_id: str) -> JobDescription:
        """Create a new job description."""
        payload = job_data.model_dump()
        payload["output_description"] = generated_description
        payload["user_id"] = user_id
        db_job = JobDescription(**payload)
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        return db_job

    @staticmethod
    def get_job_by_id(db: Session, job_id: str) -> Optional[JobDescription]:
        """Get job description by ID."""
        return db.query(JobDescription).filter(JobDescription.id == job_id).first()

    @staticmethod
    def get_all_jobs(db: Session, skip: int = 0, limit: int = 100) -> list[JobDescription]:
        """Get all job descriptions with pagination."""
        return db.query(JobDescription).offset(skip).limit(limit).all()

    @staticmethod
    def update_job(db: Session, job_id: str, job_data: dict) -> Optional[JobDescription]:
        """Update job description by ID."""
        db_job = JobDescriptionCRUD.get_job_by_id(db, job_id)
        if not db_job:
            return None

        for key, value in job_data.items():
            if value is not None:
                setattr(db_job, key, value)

        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        return db_job

    @staticmethod
    def delete_job(db: Session, job_id: str) -> bool:
        """Delete job description by ID."""
        db_job = JobDescriptionCRUD.get_job_by_id(db, job_id)
        if not db_job:
            return False

        db.delete(db_job)
        db.commit()
        return True

    @staticmethod
    def get_user_jobs(db: Session, user_id: str):
        return db.query(JobDescription).filter(JobDescription.user_id == user_id).all()

    @staticmethod
    def jd_to_dict(jd: JobDescription) -> dict:
        return {
            "id": jd.id,
            "job_title": jd.job_title,
            "company_name": jd.company_name,
            "department": jd.department,
            "location": jd.location,
            "level": jd.level,
            "tone_style": jd.tone_style,
            "skills": jd.skills,
            "responsibilities": jd.responsibilities,
            "additional_data": jd.additional_data,
            "input_description": jd.input_description,
            "output_description": jd.output_description,
            "user_id": jd.user_id,
            "created_at": jd.created_at.isoformat(),
            "updated_at": jd.updated_at.isoformat(),
        }
