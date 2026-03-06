from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import jwt
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# For OTP
from fastapi import HTTPException
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
import secrets
import string
import os


# ========================== FOR LOGIN ========================

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)
    

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def hash_otp(otp: str) -> str:
    """Hash an OTP using bcrypt."""
    return pwd_context.hash(otp)


def verify_otp_hash(plain_otp: str, hashed_otp: str) -> bool:
    """Verify an OTP against its hash."""
    return pwd_context.verify(plain_otp, hashed_otp)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # type: ignore
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode a JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # type: ignore
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.PyJWTError:
        return None


# ========================== FOR OTP ========================


# SIGNING_SECRET = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET"
SIGNING_SECRET = SECRET_KEY
OTP_EXPIRY_SECONDS = 120  # 2 minutes

serializer = URLSafeTimedSerializer(SIGNING_SECRET) # type: ignore

def generate_otp(length: int = 6) -> str:
    return "".join(secrets.choice(string.digits) for _ in range(length))


def create_signed_token(email: str, otp: str) -> str:
    return serializer.dumps(
        {"email": email, "otp": otp}
    )


def verify_signed_token(token: str, otp: str) -> str:
    try:
        data = serializer.loads(token, max_age=OTP_EXPIRY_SECONDS)
    except SignatureExpired:
        raise HTTPException(status_code=400, detail="OTP expired")
    except BadSignature:
        raise HTTPException(status_code=400, detail="Invalid token")

    if data["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    return data["email"]



# ========================== FOR EMAIL VERIFICATION AND PASSWORD RESET ========================


EMAIL_VERIFY_EXPIRE_MINUTES = 15

def create_email_verification_token(user_id: str) -> str:
    return create_access_token(
        data={
            "sub": user_id,
            "purpose": "email_verification"
        },
        expires_delta=timedelta(minutes=EMAIL_VERIFY_EXPIRE_MINUTES)
    )

