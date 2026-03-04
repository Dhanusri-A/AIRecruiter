from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.v1.deps import get_current_user, require_role
from app.db.base import get_db
from app.db.crud import UserCRUD
from app.schemas.recruiter import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from app.db.models import UserRole

router = APIRouter(
    prefix="/recruiters",
    tags=["recruiters"],
    # dependencies=[Depends(get_current_user)],
)


@router.post("", response_model=RecruiterResponse, status_code=status.HTTP_201_CREATED)
def create_recruiter(
    recruiter_data: RecruiterCreate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    """Create a new recruiter (user with recruiter role)."""
    try:
        from app.schemas.user import UserCreate
        user_create = UserCreate(
            email=recruiter_data.email,
            username=recruiter_data.username,
            password=recruiter_data.password,
            full_name=recruiter_data.full_name,
            role=UserRole.RECRUITER,
        )
        db_recruiter = UserCRUD.create_user(db, user_create)
        return db_recruiter
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to create recruiter: {str(e)}"
        )


@router.get("", response_model=list[RecruiterResponse])
def get_recruiters(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    user = Depends(require_role("admin")),
):
    """Get all recruiters with pagination."""
    recruiters = UserCRUD.get_users_by_role(db, UserRole.RECRUITER)
    return recruiters[skip : skip + limit]


@router.get("/{recruiter_id}", response_model=RecruiterResponse)
def get_recruiter(
    recruiter_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    """Get a specific recruiter by ID."""
    db_recruiter = UserCRUD.get_user_by_id(db, recruiter_id)
    if not db_recruiter or db_recruiter.role != UserRole.RECRUITER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recruiter with ID {recruiter_id} not found"
        )
    return db_recruiter


@router.put("/{recruiter_id}", response_model=RecruiterResponse)
def update_recruiter(
    recruiter_id: str,
    recruiter_data: RecruiterUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    """Update a recruiter by ID."""
    db_recruiter = UserCRUD.get_user_by_id(db, recruiter_id)
    if not db_recruiter or db_recruiter.role != UserRole.RECRUITER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recruiter with ID {recruiter_id} not found"
        )

    from app.schemas.user import UserUpdate
    user_update = UserUpdate(
        full_name=recruiter_data.full_name,
        password=recruiter_data.password,
        is_active=recruiter_data.is_active,
    )
    db_recruiter = UserCRUD.update_user(db, recruiter_id, user_update)
    return db_recruiter


@router.delete("/{recruiter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recruiter(
    recruiter_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin","recruiter")),
):
    """Delete (soft delete) a recruiter by ID."""
    db_recruiter = UserCRUD.get_user_by_id(db, recruiter_id)
    if not db_recruiter or db_recruiter.role != UserRole.RECRUITER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recruiter with ID {recruiter_id} not found"
        )

    success = UserCRUD.delete_user(db, recruiter_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete recruiter"
        )
    return None
