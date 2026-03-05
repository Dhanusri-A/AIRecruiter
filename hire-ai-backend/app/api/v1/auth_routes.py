from urllib.parse import urlencode
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import timedelta, datetime

from app.db.base import get_db
from app.db.crud import UserCRUD
from app.schemas.user import  UserCreate, UserLogin, UserResponse, UserUpdate, VerifyEmailRequest
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, create_email_verification_token, decode_access_token, hash_password
from app.api.v1.deps import get_current_user


from app.core import config
import httpx
import jwt 
from app.db.models import UserRole, OTP

# For Email OTP
from app.schemas.otp import SendOTPRequest, SendOTPResponse, VerifyOTPRequest, VerifyOTPResponse, ResetPasswordRequest   
from app.services.email_sender import send_email, send_verification_email
from app.core.security import generate_otp, create_signed_token, verify_signed_token
from app.core.email import send_otp_email

import os
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Register a new user."""
    try:
        user = UserCRUD.create_user(db, user_data)
        # token = create_email_verification_token(user.id)
        # verify_link = f"{config.FRONTEND_URL}/verify-email?token={token}"
        # background_tasks.add_task(
        #     send_verification_email,
        #     to_email=user.email,
        #     verify_link=verify_link,
        # )
        return UserResponse.model_validate(user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login")
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT token."""
    user = UserCRUD.authenticate_user(db, login_data.email, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # if not user.is_email_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="User Not Verified",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current logged-in user info."""
    return current_user



# ========== VERIFY USER ==================================================

@router.post("/verify-email")
def verify_email(body: VerifyEmailRequest, db: Session = Depends(get_db)):
    payload = decode_access_token(body.token)

    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if payload.get("purpose") != "email_verification":
        raise HTTPException(status_code=400, detail="Invalid token purpose")

    user_id = payload.get("sub")
    user = UserCRUD.get_user_by_id(db, user_id) # type: ignore

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_email_verified:
        return {"success": True, "message": "Email already verified"}

    UserCRUD.mark_email_verified(db, user_id) # type: ignore

    return {"success": True, "message": "Email verified successfully"}


@router.post("/resend-verification")
def resend_verification(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")

    token = create_email_verification_token(current_user.id)
    link = f"{config.FRONTEND_URL}/verify-email?token={token}"

    send_verification_email(current_user.email, link)

    return {"success": True}




# ========== MAIL SENDING OTP ==================================================


@router.post("/otp/send", response_model=SendOTPResponse)
def send_otp(payload: SendOTPRequest):
    otp = generate_otp()
    token = create_signed_token(payload.email, otp)

    # TODO: send OTP via email or SMS
    send_email(payload.email, otp, payload.purpose)
    print(f"[DEBUG] OTP for {payload.email}: {otp}")

    return {"token": token}


@router.post("/otp/verify", response_model=VerifyOTPResponse)
def verify_otp(payload: VerifyOTPRequest):
    email_from_token = verify_signed_token(payload.token, payload.otp)

    if email_from_token != payload.email:
        raise HTTPException(status_code=400, detail="Email mismatch")

    # OTP verified successfully
    return {"success": True}






# ======================== OAuth ====================================


# Google OAuth endpoints
@router.get("/google/login")
async def google_login():
    """Initiate Google OAuth login."""
    if not config.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    params = {
        "client_id": config.GOOGLE_CLIENT_ID,
        "redirect_uri": config.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    print(f"Redirecting to Google: {google_auth_url}")
    return RedirectResponse(url=google_auth_url, status_code=302)


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    """Handle Google OAuth callback."""
    try:
        # Exchange code for token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": config.GOOGLE_CLIENT_ID,
                    "client_secret": config.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": config.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code"
                }
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to get access token: {token_response.text}")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            # Get user info
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_info_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info")
            
            user_info = user_info_response.json()
        
        email = user_info.get("email")
        name = user_info.get("name")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
        
        # Check if user exists
        user = UserCRUD.get_user_by_email(db, email)
        
        if not user:
            # Create new user
            username = name or email.split("@")[0]
            counter = 1
            original_username = username
            while UserCRUD.get_user_by_username(db, username):
                username = f"{original_username}{counter}"
                counter += 1
            
            user_data = UserCreate(
                email=email,
                username=username,
                full_name=name or email.split("@")[0],
                password="google_oauth_" + email,
                role=UserRole.RECRUITER
            )
            user = UserCRUD.create_user(db, user_data)
        
        # Generate JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role.value, "full_name": user.full_name},
            expires_delta=access_token_expires
        )
        
        # Redirect to frontend with token
        frontend_url = f"{FRONTEND_URL}/auth/google/success?token={jwt_token}"
        return RedirectResponse(url=frontend_url)
    
    except Exception as e:
        error_url = f"{FRONTEND_URL}/recruiter-signin?error={str(e)}"
        return RedirectResponse(url=error_url)


# Microsoft OAuth endpoints
@router.get("/microsoft/login")
async def microsoft_login():
    """Initiate Microsoft OAuth login."""
    if not config.MICROSOFT_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Microsoft OAuth not configured")
    
    params = {
        "client_id": config.MICROSOFT_CLIENT_ID,
        "redirect_uri": config.MICROSOFT_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "response_mode": "query"
    }
    
    microsoft_auth_url = f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?{urlencode(params)}"
    print(f"Redirecting to Microsoft: {microsoft_auth_url}")
    return RedirectResponse(url=microsoft_auth_url, status_code=302)


@router.get("/microsoft/callback")
async def microsoft_callback(code: str, db: Session = Depends(get_db)):
    """Handle Microsoft OAuth callback."""
    try:
        # Exchange code for token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://login.microsoftonline.com/common/oauth2/v2.0/token",
                data={
                    "code": code,
                    "client_id": config.MICROSOFT_CLIENT_ID,
                    "client_secret": config.MICROSOFT_CLIENT_SECRET,
                    "redirect_uri": config.MICROSOFT_REDIRECT_URI,
                    "grant_type": "authorization_code"
                }
            )
            
            print(f"Microsoft token response status: {token_response.status_code}")
            print(f"Microsoft token response: {token_response.text}")
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to get access token: {token_response.text}")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")

            id_token = token_data.get("id_token")
            user_info = jwt.decode(id_token, options={"verify_signature": False})
        
        email = user_info.get("email") or user_info.get("preferredUsername")
        name = user_info.get("name")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Microsoft")
        
        # Check if user exists
        user = UserCRUD.get_user_by_email(db, email)
        
        if not user:
            # Create new user
            username = email.split("@")[0]
            counter = 1
            original_username = username
            while UserCRUD.get_user_by_username(db, username):
                username = f"{original_username}{counter}"
                counter += 1
            
            user_data = UserCreate(
                email=email,
                username=username,
                full_name=name or email.split("@")[0],
                password="microsoft_oauth_" + email,
                role=UserRole.RECRUITER
            )
            user = UserCRUD.create_user(db, user_data)
        
        # Generate JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role.value},
            expires_delta=access_token_expires
        )
        
        # Redirect to frontend with token
        frontend_url = f"{FRONTEND_URL}/auth/microsoft/success?token={jwt_token}"
        return RedirectResponse(url=frontend_url)
    
    except Exception as e:
        error_url = f"{FRONTEND_URL}/recruiter-signin?error={str(e)}"
        return RedirectResponse(url=error_url)


# OTP endpoints for password reset
@router.post("/send-otp")
async def send_otp_db(request: SendOTPRequest, db: Session = Depends(get_db)):
    """Send OTP to email."""
    if request.purpose == "reset_password":
        user = UserCRUD.get_user_by_email(db, request.email)
        if not user:
            raise HTTPException(status_code=404, detail="Email not found")
    elif request.purpose == "signup":
        user = UserCRUD.get_user_by_email(db, request.email)
        if user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_otp = db.query(OTP).filter(
        OTP.email == request.email,
        OTP.purpose == request.purpose
    ).first()
    
    if existing_otp:
        if existing_otp.resend_count >= 2:
            time_since_creation = (datetime.utcnow() - existing_otp.created_at).total_seconds()
            if time_since_creation < 600:
                wait_time = int(600 - time_since_creation)
                raise HTTPException(status_code=429, detail=f"Maximum resend limit reached. Please try again after {wait_time} seconds")
            else:
                db.delete(existing_otp)
                db.commit()
                existing_otp = None
    
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=1)
    
    if existing_otp:
        existing_otp.otp = otp_code
        existing_otp.expires_at = expires_at
        existing_otp.resend_count += 1
        existing_otp.is_verified = False
    else:
        db_otp = OTP(
            email=request.email,
            otp=otp_code,
            purpose=request.purpose,
            expires_at=expires_at
        )
        db.add(db_otp)
    
    db.commit()
    
    try:
        await send_otp_email(request.email, otp_code, request.purpose)
    except Exception as e:
        pass
    
    remaining = 2 - (existing_otp.resend_count if existing_otp else 0)
    return {"message": "OTP sent successfully", "resends_remaining": remaining}


@router.post("/verify-otp")
async def verify_otp_db(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify OTP."""
    otp_record = db.query(OTP).filter(
        OTP.email == request.email,
        OTP.purpose == request.purpose,
        OTP.is_verified == False
    ).first()
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid OTP or OTP already used")
    
    if datetime.utcnow() > otp_record.expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if otp_record.otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    otp_record.is_verified = True
    db.commit()
    
    return {"message": "OTP verified successfully"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using verified OTP."""
    otp_record = db.query(OTP).filter(
        OTP.email == request.email,
        OTP.otp == request.otp,
        OTP.purpose == "reset_password",
        OTP.is_verified == True
    ).first()
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="OTP not verified")
    
    user = UserCRUD.get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = hash_password(request.new_password)
    db.commit()
    
    db.delete(otp_record)
    db.commit()
    
    return {"message": "Password reset successfully"}