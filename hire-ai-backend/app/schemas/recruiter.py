from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.db.models.user_role import UserRole


class RecruiterBase(BaseModel):
    """Base recruiter schema."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)


class RecruiterCreate(RecruiterBase):
    """Recruiter creation schema."""
    password: str = Field(..., min_length=8)


class RecruiterUpdate(BaseModel):
    """Recruiter update schema."""
    full_name: Optional[str] = Field(None, max_length=255)
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None


class RecruiterResponse(RecruiterBase):
    """Recruiter response schema."""
    id: str
    is_active: bool
    role: UserRole
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)