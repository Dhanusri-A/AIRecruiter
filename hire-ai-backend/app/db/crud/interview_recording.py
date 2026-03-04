from typing import Optional, List
from sqlalchemy.orm import Session

from app.db.models.interview_recording import InterviewRecording


class InterviewRecordingCRUD:

    # CREATE
    @staticmethod
    def create(
        db: Session,
        interview_id: str,
        question_index: int,
        s3_object_key: str,
    ) -> InterviewRecording:
        recording = InterviewRecording(
            interview_id=interview_id,
            question_index=question_index,
            s3_object_key=s3_object_key,
        )
        db.add(recording)
        db.commit()
        db.refresh(recording)
        return recording

    # GET by ID
    @staticmethod
    def get_by_id(
        db: Session,
        recording_id: str,
    ) -> Optional[InterviewRecording]:
        return (
            db.query(InterviewRecording)
            .filter(InterviewRecording.id == recording_id)
            .first()
        )

    # GET by interview + question
    @staticmethod
    def get_by_interview_and_question(
        db: Session,
        interview_id: str,
        question_index: int,
    ) -> Optional[InterviewRecording]:
        return (
            db.query(InterviewRecording)
            .filter(
                InterviewRecording.interview_id == interview_id,
                InterviewRecording.question_index == question_index,
            )
            .first()
        )

    # GET ALL by interview
    @staticmethod
    def get_all_by_interview(
        db: Session,
        interview_id: str,
    ) -> List[InterviewRecording]:
        return (
            db.query(InterviewRecording)
            .filter(InterviewRecording.interview_id == interview_id)
            .order_by(InterviewRecording.question_index)
            .all()
        )

    # GET ALL (admin/debug use)
    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ) -> List[InterviewRecording]:
        return (
            db.query(InterviewRecording)
            .offset(skip)
            .limit(limit)
            .all()
        )

    # UPDATE (used for re-recording overwrite)
    @staticmethod
    def upsert(
        db: Session,
        interview_id: str,
        question_index: int,
        s3_object_key: str,
    ) -> InterviewRecording:
        recording = InterviewRecordingCRUD.get_by_interview_and_question(
            db, interview_id, question_index
        )

        if recording:
            recording.s3_object_key = s3_object_key
        else:
            recording = InterviewRecording(
                interview_id=interview_id,
                question_index=question_index,
                s3_object_key=s3_object_key,
            )
            db.add(recording)

        db.commit()
        db.refresh(recording)
        return recording

    # DELETE one
    @staticmethod
    def delete(
        db: Session,
        interview_id: str,
        question_index: int,
    ) -> bool:
        recording = InterviewRecordingCRUD.get_by_interview_and_question(
            db, interview_id, question_index
        )

        if not recording:
            return False

        db.delete(recording)
        db.commit()
        return True
