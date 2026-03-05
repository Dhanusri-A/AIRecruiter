import smtplib
import asyncio
from concurrent.futures import ThreadPoolExecutor
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core import config

executor = ThreadPoolExecutor(max_workers=3)

def _send_email_sync(to_email: str, otp: str, purpose: str):
    """Synchronous email sending function."""
    try:
        if not config.SMTP_USER or not config.SMTP_PASSWORD:
            print(f"[DEBUG] SMTP not configured. OTP for {to_email}: {otp}")
            return True
        
        subject = f"Your OTP for {purpose.replace('_', ' ').title()}"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #10b981; margin-bottom: 20px;">Your OTP Code</h2>
                    <p style="color: #374151; font-size: 16px;">Your OTP for {purpose.replace('_', ' ')} is:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #10b981; letter-spacing: 8px; margin: 0; font-size: 36px;">{otp}</h1>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This code will expire in 1 minute.</p>
                    <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">HireAI - AI-Powered Recruitment Platform</p>
                </div>
            </body>
        </html>
        """
        
        msg = MIMEMultipart()
        msg['From'] = config.SMTP_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"[SUCCESS] OTP sent to {to_email}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send email to {to_email}: {str(e)}")
        print(f"[DEBUG] OTP for {to_email}: {otp}")
        return False

async def send_otp_email(to_email: str, otp: str, purpose: str = "signup"):
    """Send OTP via email asynchronously."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, _send_email_sync, to_email, otp, purpose)
