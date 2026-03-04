from datetime import datetime
import uuid

from sqlalchemy import String, Boolean, DateTime, Enum as SQLEnum, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

from app.db.models.candidate_status import CandidateStatus

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.db.models.user import User
    from app.db.models.education import Education
    from app.db.models.work_experience import WorkExperience
    from app.db.models.certification import Certification

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        # unique=True,
        nullable=False,
        index=True,
    )

    recruiter_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    first_name: Mapped[str | None] = mapped_column(
        String(155),
        nullable=True,
    )
    
    last_name: Mapped[str | None] = mapped_column(
        String(155),
        nullable=True,
    )
    
    title: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    
    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )
    
    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    
    profile_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    
    total_years_experience: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    
    notice_period: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    
    expected_salary: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    
    preferred_mode: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    
    profiles: Mapped[str | None] = mapped_column(
        JSON,
        nullable=True,
    )
    
    languages: Mapped[str | None] = mapped_column(
        JSON,
        nullable=True,
    )

    status: Mapped[CandidateStatus] = mapped_column(
        SQLEnum(CandidateStatus),
        default=CandidateStatus.SOURCED,
        nullable=False,
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="candidate_profile",
    )

    recruiter: Mapped["User"] = relationship(
        "User",
        foreign_keys=[recruiter_id],
    )

    education_records: Mapped[list["Education"]] = relationship(
        "Education", back_populates="candidate_profile", cascade="all, delete-orphan"
    )
    work_experiences: Mapped[list["WorkExperience"]] = relationship(
        "WorkExperience", back_populates="candidate_profile", cascade="all, delete-orphan"
    )
    certifications: Mapped[list["Certification"]] = relationship(
        "Certification", back_populates="candidate_profile", cascade="all, delete-orphan",
    )


    def __repr__(self) -> str:
        return f"<CandidateProfile(id={self.id}, user_id={self.user_id}, first_name='{self.first_name}')>"
