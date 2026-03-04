from typing import Optional

from pydantic import BaseModel


class TextRequest(BaseModel):
    text: str

class ResumeDataRequest(BaseModel):
    resumeData: dict
    resumeText: Optional[str] = None

class GenerateRequest(BaseModel):
    resumeData: dict

class ExportRequest(BaseModel):
    format: str
    resumeData: dict