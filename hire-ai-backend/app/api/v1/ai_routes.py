# Import all candidate routes from the new route files for backward compatibility
from fastapi import APIRouter, Depends

# Also export the AI endpoint from profile router
from app.schemas.candidate_profile import PromptRequest, PromptResponse
from app.services.ask_ai import ask_ai
from fastapi import HTTPException, status
from app.api.v1.deps import require_role

# Create a combined router
router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)




@router.post("/ask_ai", response_model=PromptResponse)
def ask_ai_route(prompt: PromptRequest,user = Depends(require_role("admin","recruiter"))):
    """Ask AI anything related to hiring, candidates and others"""
    try:
        return ask_ai(prompt)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to ask AI: {str(e)}"
        )


