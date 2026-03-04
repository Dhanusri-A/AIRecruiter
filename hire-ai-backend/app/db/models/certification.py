from datetime import datetime
import uuid

from sqlalchemy import String, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

from app.db.models.certification_status import CertificationStatus

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.db.models.candidate_profile import CandidateProfile

class Certification(Base):
    __tablename__ = "certifications"

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

    certification_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    
    certification_description: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    issuing_body: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    credential_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    verification_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    issue_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    expiry_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    status: Mapped[CertificationStatus | None] = mapped_column(
        SQLEnum(CertificationStatus),
        nullable=True,
    )

    certificate_file: Mapped[str | None] = mapped_column(
        String(500),
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
        "CandidateProfile", back_populates="certifications"
    )

    def __repr__(self) -> str:
        return f"<Certification(id={self.id}, certification_name='{self.certification_name}')>"
