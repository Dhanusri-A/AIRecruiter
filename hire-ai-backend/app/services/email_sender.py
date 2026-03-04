import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


from app.core.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM



def send_email(to_email: str, otp: str, purpose: str):
    """Synchronous email sending function."""
    try:
        if not SMTP_USER or not SMTP_PASSWORD:
            return False
            
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
        msg['From'] = SMTP_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server: # type: ignore
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception:
        return False



def send_candidate_creds(to_email: str, password: str) -> bool:
    """Send login credentials to candidate via email."""
    try:
        if not SMTP_USER or not SMTP_PASSWORD:
            return False

        subject = "Your Candidate/Interview Login Credentials"

        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <img src="https://media.licdn.com/dms/image/v2/D560BAQGCICpF4Ezbig/company-logo_200_200/B56ZuhvPZMKwAI-/0/1767945075371/amztech_ai_logo?e=2147483647&v=beta&t=6AAZZ9VkEPBU2UqignLE-teoG58nPFecUTaam0PAeJw" alt="HireAI Logo" style="width: 100%; margin-bottom: 20px;">
                    <h2 style="color: #2563eb; margin-bottom: 20px;">
                        Candidate/Interview Login Details
                    </h2>

                    <p style="color: #374151; font-size: 16px;">
                        Please use the following credentials to log in to your dashboard and access your interview details:
                    </p>

                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="font-size: 16px; margin: 0;">
                            <strong>Email:</strong> {to_email}
                        </p>
                        <p style="font-size: 16px; margin: 10px 0 0 0;">
                            <strong>Password:</strong> {password}
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://amzhire.ai/candidate-signin"
                           style="
                                display: inline-block;
                                background-color: #2563eb;
                                color: #ffffff;
                                padding: 12px 24px;
                                text-decoration: none;
                                font-size: 16px;
                                border-radius: 6px;
                           ">
                            Login to Interview Portal
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px;">
                        Please keep these credentials confidential and do not share them with anyone.
                    </p>

                    <p style="color: #6b7280; font-size: 14px;">
                        You can see for what job you have been shortlisted and the interview schedule. 
                        For Interview, We recommend logging in a few minutes before your scheduled interview time.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        HireAI · AI-Powered Recruitment Platform
                    </p>
                </div>
            </body>
        </html>
        """

        msg = MIMEMultipart()
        msg["From"] = SMTP_FROM
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server: # type: ignore
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        return True

    except Exception as e:
        # log this if you have logging, swallowing errors is how bugs grow
        return False





def send_verification_email(to_email: str, verify_link: str) -> bool:
    """Send email verification link."""
    try:
        if not SMTP_USER or not SMTP_PASSWORD:
            return False

        subject = "Verify your email address"

        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white;
                            padding: 30px; border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                    <img src="https://media.licdn.com/dms/image/v2/D560BAQGCICpF4Ezbig/company-logo_200_200/B56ZuhvPZMKwAI-/0/1767945075371/amztech_ai_logo?e=2147483647&v=beta&t=6AAZZ9VkEPBU2UqignLE-teoG58nPFecUTaam0PAeJw" alt="HireAI Logo" style="width: 100%; margin-bottom: 20px;">
                    <h2 style="color: #2563eb; margin-bottom: 20px;">
                        Verify your email
                    </h2>

                    <p style="color: #374151; font-size: 16px;">
                        Thanks for signing up. Please confirm your email address by clicking the button below.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verify_link}"
                           style="
                               display: inline-block;
                               padding: 14px 28px;
                               background-color: #2563eb;
                               color: white;
                               text-decoration: none;
                               border-radius: 8px;
                               font-size: 16px;
                               font-weight: 600;
                           ">
                            Verify Email
                        </a>
                    </div>

                    <p style="color: #6b7280; font-size: 14px;">
                        This link will expire in 15 minutes.
                    </p>

                    <p style="color: #6b7280; font-size: 14px;">
                        If you did not create an account, you can safely ignore this email.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        HireAI · AI-Powered Recruitment Platform
                    </p>
                </div>
            </body>
        </html>
        """

        msg = MIMEMultipart()
        msg["From"] = SMTP_FROM
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server: # type: ignore
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        return True

    except Exception:
        return False
    




def send_interview_completed_email(interview_db: dict, email_to: str) -> bool:
    try:
        if not SMTP_USER or not SMTP_PASSWORD:
            return False

        subject = "Interview Completed"
        recruiter_portal_link = "https://amzhire.ai/recruiter-signin"

        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
                <div style="max-width: 650px; margin: auto; background: #ffffff;
                            padding: 30px; border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.08);">

                    <img src="https://media.licdn.com/dms/image/v2/D560BAQGCICpF4Ezbig/company-logo_200_200/B56ZuhvPZMKwAI-/0/1767945075371/amztech_ai_logo?e=2147483647&v=beta&t=6AAZZ9VkEPBU2UqignLE-teoG58nPFecUTaam0PAeJw" alt="HireAI Logo" style="width: 100%; margin-bottom: 20px;">
                    <h2>Interview Completed</h2>

                    <table style="width: 100%; font-size: 14px;">
                        <tr><td><strong>Candidate Name:</strong></td><td>{interview_db["candidate_name"]}</td></tr>
                        <tr><td><strong>Candidate Email:</strong></td><td>{interview_db["candidate_email"]}</td></tr>
                        <tr><td><strong>Job Title:</strong></td><td>{interview_db["job_title"]}</td></tr>
                        <tr><td><strong>Date:</strong></td><td>{interview_db["date"]}</td></tr>
                        <tr><td><strong>Time:</strong></td><td>{interview_db["time"]}</td></tr>
                    </table>

                    <div style="text-align:center; margin-top:30px;">
                        <a href="{recruiter_portal_link}"
                           style="padding:12px 26px; background:#2563eb;
                                  color:#fff; text-decoration:none;
                                  border-radius:6px;">
                            Login to Recruiter Portal
                        </a>
                    </div>

                     <p style="color: #6b7280; font-size: 14px;">
                        If you did not schedule the interview, you can safely ignore this email.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        HireAI · AI-Powered Recruitment Platform
                    </p>

                </div>
            </body>
        </html>
        """

        msg = MIMEMultipart()
        msg["From"] = SMTP_FROM
        msg["To"] = email_to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:  # type: ignore
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        return True

    except Exception:
        return False