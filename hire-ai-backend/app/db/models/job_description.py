from datetime import datetime
import uuid

from sqlalchemy import String, DateTime, Enum as SQLEnum, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.db.models.user import User


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    
    job_title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    
    company_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    
    department: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    level: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    
    tone_style: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    
    skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    
    responsibilities: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    
    additional_data: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    
    input_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    output_description: Mapped[str | None] = mapped_column(
        JSON,
        nullable=True,
    )

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    user: Mapped["User"] = relationship("User", backref="job_descriptions")

    
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

    def __repr__(self) -> str:
        return f"<JobDescription(id={self.id}, job_title='{self.job_title}', company_name='{self.company_name}')>"
