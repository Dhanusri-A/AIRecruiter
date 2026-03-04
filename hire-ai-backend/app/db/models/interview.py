from datetime import datetime, date as dt_date, time as dt_time
import uuid

from sqlalchemy import String, Date, Time, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.db.models.user import User
    from app.db.models.interview_recording import InterviewRecording


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )

    candidate_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    recruiter_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    candidate_name: Mapped[str] = mapped_column(String(255), nullable=False)
    candidate_email: Mapped[str] = mapped_column(String(255), nullable=False)
    job_title: Mapped[str] = mapped_column(String(255), nullable=False)
    interview_type: Mapped[str] = mapped_column(String(100), nullable=False)

    date: Mapped[dt_date] = mapped_column(Date, nullable=False)
    time: Mapped[dt_time] = mapped_column(Time, nullable=False)
    duration: Mapped[str] = mapped_column(String(100), nullable=False)

    meeting_location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    scores: Mapped[int | None] = mapped_column(nullable=True)
    qa: Mapped[list[dict] | None] = mapped_column(
        JSON,
        nullable=True
    )
    ai_summary: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships — two FKs to same table, so foreign_keys is required
    candidate: Mapped["User"] = relationship(
        "User",
        foreign_keys=[candidate_id],
        back_populates="candidate_interviews",
    )

    recruiter: Mapped["User"] = relationship(
        "User",
        foreign_keys=[recruiter_id],
        back_populates="recruiter_interviews",
    )

    recordings: Mapped[list["InterviewRecording"]] = relationship(
        "InterviewRecording",
        back_populates="interview",
        cascade="all, delete-orphan",
        order_by="InterviewRecording.question_index",
    )

    def __repr__(self) -> str:
        return f"<Interview(id={self.id}, candidate={self.candidate_name}, job={self.job_title})>"