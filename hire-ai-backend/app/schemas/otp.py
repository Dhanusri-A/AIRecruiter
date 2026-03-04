from pydantic import BaseModel, EmailStr, Field

class SendOTPRequest(BaseModel):
    email: EmailStr
    purpose: str 

class SendOTPResponse(BaseModel):
    token: str


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str
    token: str

class VerifyOTPResponse(BaseModel):
    success: bool