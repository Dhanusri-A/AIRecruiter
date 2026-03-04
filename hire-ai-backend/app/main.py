from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import APP_NAME, APP_VERSION
from app.db.base import create_tables

from app.api.v1 import auth_routes, user_routes, jobs_routes, recruiters_routes, ai_routes, resume_routes
from app.api.v1 import candidate_profile_routes, candidate_education_routes, candidate_work_experience_routes, candidate_certification_routes
from app.api.v1 import interview_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: Create tables
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")
    yield
    # Shutdown
    print("Application shutting down...")


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AI Recruiter Platform Backend",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with API v1 prefix
app.include_router(auth_routes.router, prefix="/api/v1")
app.include_router(user_routes.router, prefix="/api/v1")
app.include_router(jobs_routes.router, prefix="/api/v1")
app.include_router(recruiters_routes.router, prefix="/api/v1")
app.include_router(ai_routes.router, prefix="/api/v1")
app.include_router(resume_routes.router, prefix="/api/v1")

app.include_router(candidate_profile_routes.router, prefix="/api/v1")
app.include_router(candidate_education_routes.router, prefix="/api/v1")
app.include_router(candidate_work_experience_routes.router, prefix="/api/v1")
app.include_router(candidate_certification_routes.router, prefix="/api/v1")
app.include_router(interview_routes.router, prefix="/api/v1")


@app.get("/", tags=["root"])
async def root():
    """Root endpoint."""
    return {
        "message": f"Welcome to {APP_NAME}",
        "version": APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
