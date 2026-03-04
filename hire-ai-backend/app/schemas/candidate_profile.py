from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Optional, Any
from datetime import datetime

from app.schemas.user import UserResponse
from app.schemas.education import EducationResponse
from app.schemas.work_experience import WorkExperienceResponse
from app.schemas.certification import CertificationResponse
from app.db.models.candidate_status import CandidateStatus


class CandidateProfileBase(BaseModel):
    """Base candidate profile schema."""
    first_name: Optional[str] = Field(None, max_length=155)
    last_name: Optional[str] = Field(None, max_length=155)
    title: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
    location: Optional[str] = Field(None, max_length=255)
    skills: Optional[str] = None
    profile_summary: Optional[str] = None
    total_years_experience: Optional[str] = Field(None, max_length=50)
    notice_period: Optional[str] = Field(None, max_length=100)
    expected_salary: Optional[str] = Field(None, max_length=100)
    preferred_mode: Optional[str] = Field(None, max_length=100)
    profiles: Optional[Any] = None
    languages: Optional[Any] = None
    status: Optional[CandidateStatus] = None


class CandidateProfileCreate(CandidateProfileBase):
    """Candidate profile creation schema - used with user creation."""
    pass


class CandidateProfileUpdate(BaseModel):
    """Candidate profile update schema."""
    first_name: Optional[str] = Field(None, max_length=155)
    last_name: Optional[str] = Field(None, max_length=155)
    title: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
    location: Optional[str] = Field(None, max_length=255)
    skills: Optional[str] = None
    profile_summary: Optional[str] = None
    total_years_experience: Optional[str] = Field(None, max_length=50)
    notice_period: Optional[str] = Field(None, max_length=100)
    expected_salary: Optional[str] = Field(None, max_length=100)
    preferred_mode: Optional[str] = Field(None, max_length=100)
    profiles: Optional[Any] = None
    languages: Optional[Any] = None
    status: Optional[CandidateStatus] = None


class CandidateProfileResponse(CandidateProfileBase):
    """Candidate profile response schema."""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Request body for candidate creation
class CandidateCreateRequest(BaseModel):
    """Request body for creating a new candidate with user and profile."""
    email: EmailStr
    first_name: str = Field(..., max_length=155)
    last_name: str = Field(..., max_length=155)
    title: str | None = Field(None, max_length=255)
    image_url: str | None = Field(None, max_length=500)
    phone: str | None = Field(None, max_length=20)
    location: str | None = Field(None, max_length=255)
    skills: str | None = None
    profile_summary: str | None = None
    total_years_experience: str | None = Field(None, max_length=50)
    notice_period: str | None = Field(None, max_length=100)
    expected_salary: str | None = Field(None, max_length=100)
    preferred_mode: str | None = Field(None, max_length=100)
    languages: dict | None = None
    profiles: dict | None = None
    education: list = []
    work_experiences: list = []
    certifications: list = []


class CandidateCreateResponse(BaseModel):
    user: UserResponse
    profile: CandidateProfileResponse
    work_experiences: list[WorkExperienceResponse] = []
    education_records: list[EducationResponse] = []
    certifications: list[CertificationResponse] = []

    model_config = ConfigDict(from_attributes=True)


class CandidateProfileDetailResponse(CandidateProfileResponse):
    """Candidate profile detail response schema with education and work experience."""
    user: UserResponse
    education_records: Optional[list[EducationResponse]] = []
    work_experiences: Optional[list[WorkExperienceResponse]] = []
    certifications: list[CertificationResponse] = []


# Prompt schemas
class PromptRequest(BaseModel):
    prompt: str


class PromptResponse(PromptRequest):
    response: str


# Pydantic Schemas
class SearchRequest(BaseModel):
    job_title: str
    location: str
    source: str  # linkedin or naukri

class SearchResult(BaseModel):
    name : str
    location : str
    source : str
    job_title : str
    description : str

