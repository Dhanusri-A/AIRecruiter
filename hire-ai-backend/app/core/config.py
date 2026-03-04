import os
from dotenv import load_dotenv
from sqlalchemy.engine import URL

load_dotenv()

# Database
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT, # type: ignore
    database=DB_NAME,
)

# JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200

# App Settings
APP_NAME = "HireAI Backend"
APP_VERSION = "0.1.0"

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# GOOGLE OAUTH
GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "")

# MICROSOFT OAUTH
MICROSOFT_CLIENT_ID: str = os.getenv("MICROSOFT_CLIENT_ID", "")
MICROSOFT_CLIENT_SECRET: str = os.getenv("MICROSOFT_CLIENT_SECRET", "")
MICROSOFT_REDIRECT_URI: str = os.getenv("MICROSOFT_REDIRECT_URI", "")

# FOR MAILING
SMTP_HOST = os.getenv("SMTP_HOST","")
SMTP_PORT = os.getenv("SMTP_PORT","")
SMTP_USER = os.getenv("SMTP_USER","")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD","")
SMTP_FROM = os.getenv("SMTP_FROM","")

# FOR AWS S3
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID","")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY","")
AWS_REGION = os.getenv("AWS_REGION","")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME","")

# For Candidate Sourcing - Custom Search
SERPER_API_KEY=os.getenv("SERPER_API_KEY","")
