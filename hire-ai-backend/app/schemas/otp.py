from pydantic import BaseModel, EmailStr, Field

class SendOTPRequest(BaseModel):
    email: EmailStr
    purpose: str = Field(..., description="'signup' or 'reset_password'")

class SendOTPResponse(BaseModel):
    token: str


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    token: str = ""
    purpose: str = ""

class VerifyOTPResponse(BaseModel):
    success: bool

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)