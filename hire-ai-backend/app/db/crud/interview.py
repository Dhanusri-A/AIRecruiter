from typing import Optional
from sqlalchemy.orm import Session

from fastapi import BackgroundTasks

from app.db.models.interview import Interview
from app.schemas.interview import InterviewCreate

from app.schemas.user import UserCreate, UserUpdate
from app.db.models.user_role import UserRole
from app.db.crud.user import UserCRUD
import uuid

from app.core import config
from app.core.security import create_email_verification_token

from app.services.email_sender import send_candidate_creds, send_verification_email


class InterviewCRUD:

    @staticmethod
    def create_interview(
        db: Session,
        interview_data: InterviewCreate,
        recruiter_id: str,
        background_tasks : BackgroundTasks
    ) -> Interview:

        candidate = UserCRUD.get_user_by_email(db, interview_data.candidate_email)
        temp_password = uuid.uuid4().hex[:8]

        if candidate and candidate.role != UserRole.CANDIDATE:
            raise ValueError("Email already in use by a non-candidate user")

        if not candidate:
            user_create = UserCreate(
                email=interview_data.candidate_email,
                username=interview_data.candidate_name,
                password=temp_password,
                role=UserRole.CANDIDATE,
            )
            candidate = UserCRUD.create_user(db, user_create)
            # token = create_email_verification_token(candidate.id)
            # verify_link = f"{config.FRONTEND_URL}/verify-email?token={token}"
            # background_tasks.add_task(
            #     send_verification_email,
            #     to_email=candidate.email,
            #     verify_link=verify_link,
            # )

        else:
            # reset password for existing candidate
            UserCRUD.update_user(
                db=db,
                user_id=candidate.id,
                user_data=UserUpdate(password=temp_password),
            )

        # send creds in BOTH cases
        background_tasks.add_task(
            send_candidate_creds,
            to_email=interview_data.candidate_email,
            password=temp_password,
        )

        payload = interview_data.model_dump()
        db_interview = Interview(
            **payload,
            recruiter_id=recruiter_id,
            candidate=candidate,
        )

        db.add(db_interview)
        db.commit()
        db.refresh(db_interview)
        return db_interview


    @staticmethod
    def get_interview_by_id(db: Session, interview_id: str) -> Optional[Interview]:
        return db.query(Interview).filter(Interview.id == interview_id).first()

    @staticmethod
    def get_all_interviews(
        db: Session, skip: int = 0, limit: int = 100
    ) -> list[Interview]:
        return db.query(Interview).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_candidate_id(
        db: Session, candidate_id: str, skip: int = 0, limit: int = 100
    ) -> list[Interview]:
        return (
            db.query(Interview)
            .filter(Interview.candidate_id == candidate_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_recruiter_id(
        db: Session, recruiter_id: str, skip: int = 0, limit: int = 100
    ) -> list[Interview]:
        return (
            db.query(Interview)
            .filter(Interview.recruiter_id == recruiter_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def update_interview(
        db: Session,
        interview_id: str,
        update_data: dict,
    ) -> Optional[Interview]:
        db_interview = InterviewCRUD.get_interview_by_id(db, interview_id)
        if not db_interview:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(db_interview, key, value)

        db.add(db_interview)
        db.commit()
        db.refresh(db_interview)
        return db_interview

    @staticmethod
    def delete_interview(db: Session, interview_id: str) -> bool:
        db_interview = InterviewCRUD.get_interview_by_id(db, interview_id)
        if not db_interview:
            return False
        db.delete(db_interview)
        db.commit()
        return True