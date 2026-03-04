from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class EducationBase(BaseModel):
    """Base education schema."""
    institution_name: Optional[str] = Field(None, max_length=255)
    degree: Optional[str] = Field(None, max_length=100)
    field_of_study: Optional[str] = Field(None, max_length=255)
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    gpa: Optional[str] = Field(None, max_length=10)
    honors: Optional[str] = Field(None, max_length=255)


class EducationCreate(EducationBase):
    """Education creation schema."""
    pass


class EducationUpdate(BaseModel):
    """Education update schema."""
    institution_name: Optional[str] = Field(None, max_length=255)
    degree: Optional[str] = Field(None, max_length=100)
    field_of_study: Optional[str] = Field(None, max_length=255)
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    gpa: Optional[str] = Field(None, max_length=10)
    honors: Optional[str] = Field(None, max_length=255)


class EducationResponse(EducationBase):
    """Education response schema."""
    id: str
    candidate_profile_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
