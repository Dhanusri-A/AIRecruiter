from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class JobDescriptionBase(BaseModel):
    """Base job description schema."""
    job_title: str = Field(..., min_length=1, max_length=255)
    company_name: str = Field(..., min_length=1, max_length=255)
    department: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    level: Optional[str] = Field(None, max_length=100)
    tone_style: Optional[str] = Field(None, max_length=100)
    skills: Optional[str] = None
    responsibilities: Optional[str] = None
    additional_data: Optional[str] = None
    input_description: Optional[str] = None


class JobDescriptionCreate(JobDescriptionBase):
    """Job description creation schema."""


class JobDescriptionUpdate(BaseModel):
    """Job description update schema."""
    job_title: Optional[str] = Field(None, min_length=1, max_length=255)
    company_name: Optional[str] = Field(None, min_length=1, max_length=255)
    department: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    level: Optional[str] = None
    tone_style: Optional[str] = None
    skills: Optional[str] = None
    responsibilities: Optional[str] = None
    additional_data: Optional[str] = None
    input_description: Optional[str] = None
    user_id: Optional[str] = Field(None, description="Change the owner user_id if needed")



class JobDescriptionResponse(JobDescriptionBase):
    """Job description response schema."""
    id: str
    user_id: str  
    output_description: Optional[dict] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
