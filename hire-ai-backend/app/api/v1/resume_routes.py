import os
import tempfile
from typing import Dict, List
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import FileResponse
from app.api.v1.deps import get_current_user, require_role

from sqlalchemy.orm import Session

from app.services.resume_parser import parse_resume
from app.services.resume_matcher import match_resumes

from app.db.base import get_db
from app.db.crud.job_description import JobDescriptionCRUD

from app.schemas.resume import TextRequest, ResumeDataRequest, GenerateRequest, ExportRequest

from app.services.resume_reformat.docx_generator import generate_synpulse_docx
from app.services.resume_reformat.pdf_generator import generate_synpulse_resume
from app.services.resume_reformat.pptx_generator import generate_synpulse_pptx
from app.services.resume_reformat.resume_assist import process_uploaded_file
from app.services.resume_reformat.resume_parser import extract_resume_data

router = APIRouter(
    prefix="/resume",
    tags=["resume"],
    # dependencies=[Depends(get_current_user)],
)





@router.post(
    "/parse",status_code=status.HTTP_200_OK,
)
def parse_resume_post(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    user = Depends(require_role("admin","recruiter")),
):
    """
    Parse a resume file (PDF, DOCX, PPTX) and return structured data.
    Requires authentication.
    """

    # Basic validation early, before touching AI or memory
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name is missing",
        )

    try:
        # AI parsing (this must be awaited)
        parsed_data = parse_resume(file)

        if not parsed_data:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Failed to extract resume data",
            )

        return {
            "user_id": current_user.id,
            "filename": file.filename,
            "data": parsed_data,
        }

    except HTTPException:
        # Re-raise clean HTTP errors untouched
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to parse resume"
        )

    except ValueError as exc:
        # File parsing / unsupported format errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except Exception as exc:
        # Catch-all safety net
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume parsing failed: {str(exc)}",
        )
    


@router.post(
    "/match/{job_id}",
    status_code=status.HTTP_200_OK,
)
def match_resumes_post(
    job_id: str,
    resumes: List[UploadFile],
    db=Depends(get_db),
    current_user = Depends(require_role("admin","recruiter")),
):
    """
    Match multiple parsed resumes against a parsed job description.
    Requires authentication.
    """
    # ---- Basic validation ----
    if not job_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job ID data is missing",
        )
    
    job = JobDescriptionCRUD.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job data is missing, Invalid or not found",
        )

    if not resumes or not isinstance(resumes, list):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resumes list is missing or invalid",
        )
    try:
        job_dict = JobDescriptionCRUD.jd_to_dict(job)
        results = match_resumes(resumes, job_dict)
        print("\nRESULTS=============\n", results)
        if not results:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Resume matching returned no results",
            )
        return {
            "user_id": current_user.id,
            "job": job.job_title,
            "total_resumes": len(resumes),
            "matches": results,
        }

    except HTTPException as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error raising here, check now + {str(exc)}",
        )      
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume matching failed: {str(exc)}",
        )





# Configure upload folder
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'ppt', 'pptx'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@router.post("/reformat/parse")
async def parse_resume_final(
    file: UploadFile = File(...),
    user = Depends(require_role("admin","recruiter")),
):
    if not allowed_file(file.filename):
        raise HTTPException(400, "Invalid file type")
    text = process_uploaded_file(file)
    try:
        resume_data = extract_resume_data(text)
        return {
            "resumeData": resume_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Got error : {str(e)}")
   

@router.post("/reformat/export")
async def export_resume_final(
    request: ExportRequest,
    user = Depends(require_role("admin","recruiter")),
):
    fmt = request.format.lower()
    data = request.resumeData

    path = None
    media = None
    name = None

    if fmt == "pdf":
        path = generate_synpulse_resume(data)
        media = "application/pdf"
        name = "resume.pdf"

    elif fmt == "pptx":
        path = generate_synpulse_pptx(data)
        media = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        name = "resume.pptx"

    elif fmt == "docx":
        path = generate_synpulse_docx(data)
        media = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        name = "resume.docx"

    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

    if not path or not isinstance(path, (str, os.PathLike)):
        raise HTTPException(
            status_code=500,
            detail=f"Resume generation failed for format: {fmt}",
        )

    if not os.path.exists(path):
        raise HTTPException(
            status_code=500,
            detail=f"Generated file does not exist: {path}",
        )

    return FileResponse(path, media_type=media, filename=name)
