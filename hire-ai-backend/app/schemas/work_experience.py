from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class WorkExperienceBase(BaseModel):
    """Base work experience schema."""
    company_name: Optional[str] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, max_length=255)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None


class WorkExperienceCreate(WorkExperienceBase):
    """Work experience creation schema."""
    pass


class WorkExperienceUpdate(BaseModel):
    """Work experience update schema."""
    company_name: Optional[str] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, max_length=255)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None


class WorkExperienceResponse(WorkExperienceBase):
    """Work experience response schema."""
    id: str
    candidate_profile_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
