from datetime import datetime
import uuid

from sqlalchemy import String, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.db.models.candidate_profile import CandidateProfile


class WorkExperience(Base):
    __tablename__ = "work_experience"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    
    candidate_profile_id: Mapped[str] = mapped_column(
        ForeignKey("candidate_profiles.id"),
        nullable=False,
        index=True,
    )
    
    company_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    job_title: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    start_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    end_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
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
    candidate_profile: Mapped["CandidateProfile"] = relationship(
        "CandidateProfile", back_populates="work_experiences"
    )

    def __repr__(self) -> str:
        return f"<WorkExperience(id={self.id}, candidate_profile_id={self.candidate_profile_id}, company_name='{self.company_name}')>"
