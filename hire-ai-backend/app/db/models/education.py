from datetime import datetime
import uuid

from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.db.models.candidate_profile import CandidateProfile


class Education(Base):
    __tablename__ = "education"

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
    
    institution_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    degree: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    
    field_of_study: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    start_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    
    end_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    
    gpa: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
    )
    
    honors: Mapped[str | None] = mapped_column(
        String(255),
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
        "CandidateProfile", back_populates="education_records"
    )

    def __repr__(self) -> str:
        return f"<Education(id={self.id}, candidate_profile_id={self.candidate_profile_id}, degree='{self.degree}')>"
