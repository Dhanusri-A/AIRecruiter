from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Dict, Optional
from datetime import datetime, date as dt_date, time as dt_time


class InterviewBase(BaseModel):
    candidate_id: str
    candidate_name: str = Field(..., min_length=1, max_length=255)
    candidate_email: EmailStr = Field(..., max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    interview_type: str = Field(..., min_length=1, max_length=100)
    date: dt_date                          # YYYY-MM-DD
    time: dt_time                          # HH:MM:SS
    duration: str = Field(..., max_length=100)
    meeting_location: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = Field(None, max_length=2000)
    


class InterviewCreate(BaseModel):
    """Fields required to schedule an interview.
    recruiter_id is injected from the current authenticated user — not sent by client.
    """
    candidate_name: str = Field(..., min_length=1, max_length=255)
    candidate_email: EmailStr = Field(..., max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    interview_type: str = Field(..., min_length=1, max_length=100)
    date: dt_date                          # YYYY-MM-DD
    time: dt_time                          # HH:MM:SS
    duration: str = Field(..., max_length=100)
    meeting_location: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = Field(None, max_length=2000)


class InterviewUpdate(BaseModel):
    """All fields optional for partial update."""
    candidate_id: Optional[str] = None
    candidate_name: Optional[str] = Field(None, min_length=1, max_length=255)
    candidate_email: Optional[EmailStr] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, min_length=1, max_length=255)
    interview_type: Optional[str] = Field(None, max_length=100)
    date: Optional[dt_date] = None
    time: Optional[dt_time] = None
    duration: Optional[str] = Field(None, max_length=100)
    meeting_location: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = Field(None, max_length=2000)
    scores: Optional[int] = Field(None, ge=0, le=100)
    ai_summary : Optional[str] = Field(None, max_length=2000)


class InterviewResponse(InterviewBase):
    """What the frontend receives."""
    id: str
    recruiter_id: str
    scores : Optional[int] = None
    qa: Optional[list[Dict]] = None
    ai_summary: Optional[Dict] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)



class QuestionAnswer(BaseModel):
    question: str
    answer: str

class InterviewQARequest(BaseModel):
    qa: list[QuestionAnswer]




class PresignedUrlRequest(BaseModel):
    content_type: str
    question_index: int


class PresignedUrlResponse(BaseModel):
    presigned_url: str
    object_key: str


class CompleteInterviewRecordingRequest(BaseModel):
    question_index: int
    object_key: str


class InterviewVideoResponse(BaseModel):
    video_url: str