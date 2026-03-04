from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

from app.db.models.certification_status import CertificationStatus


class CertificationBase(BaseModel):
    certification_name: str = Field(..., max_length=255)
    certification_description: str = Field(..., max_length=255)
    issuing_body: Optional[str] = Field(None, max_length=255)
    credential_id: Optional[str] = Field(None, max_length=100)
    verification_url: Optional[str] = Field(None, max_length=500)
    issue_date: datetime
    expiry_date: Optional[datetime] = None
    status: Optional[CertificationStatus] = Field(None, max_length=20)
    certificate_file: Optional[str] = Field(None, max_length=500)


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    certification_name: Optional[str] = Field(None, max_length=255)
    certification_description: str = Field(..., max_length=255)
    issuing_body: Optional[str] = Field(None, max_length=255)
    credential_id: Optional[str] = Field(None, max_length=100)
    verification_url: Optional[str] = Field(None, max_length=500)
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    status: Optional[CertificationStatus] = Field(None, max_length=20)
    certificate_file: Optional[str] = Field(None, max_length=500)


class CertificationResponse(CertificationBase):
    id: str
    candidate_profile_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
