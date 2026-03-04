from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.models.user import User
from app.db.models.user_role import UserRole
from app.core.security import hash_password, verify_password
from app.schemas.user import UserCreate, UserUpdate


class UserCRUD:
    """CRUD operations for User model."""

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> User:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> User:
        """Get user by username."""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_user_by_email_or_username(db: Session, email_or_username: str) -> User:
        """Get user by email or username."""
        return db.query(User).filter(
            or_(User.email == email_or_username, User.username == email_or_username)
        ).first()

    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users with pagination."""
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if email already exists
        if UserCRUD.get_user_by_email(db, user_data.email):
            raise ValueError(f"Email {user_data.email} already registered")
        print("CREATE_USER PASSWORD:", repr(user_data.password), len(user_data.password))

        # Create user with hashed password
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hash_password(user_data.password),
            role=user_data.role or UserRole.CANDIDATE,
        )
        db.add(db_user)
        db.flush()
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def update_user(db: Session, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user details."""
        db_user = UserCRUD.get_user_by_id(db, user_id)
        if not db_user:
            return None

        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                if key == "password":
                    setattr(db_user, "hashed_password", hash_password(value))
                else:
                    setattr(db_user, key, value)

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    


    @staticmethod
    def delete_user(db: Session, user_id: str) -> bool:
        """Delete a user (soft delete by setting is_active to False)."""
        db_user = UserCRUD.get_user_by_id(db, user_id)
        if not db_user:
            return False

        db_user.is_active = False
        db.add(db_user)
        db.commit()
        return True

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user and return user object if valid."""
        db_user = UserCRUD.get_user_by_email(db, email)
        if not db_user:
            return None
        if not verify_password(password, db_user.hashed_password):
            return None
        if not db_user.is_active:
            return None
        return db_user

    @staticmethod
    def get_users_by_role(db: Session, role: UserRole) -> list[User]:
        """Get all users with a specific role."""
        return db.query(User).filter(User.role == role).all()


    @staticmethod
    def mark_email_verified(db: Session, user_id: str) -> Optional[User]:
        user = UserCRUD.get_user_by_id(db, user_id)
        if not user:
            return None
        user.is_email_verified = True
        user.email_verified_at = datetime.now(timezone.utc)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    