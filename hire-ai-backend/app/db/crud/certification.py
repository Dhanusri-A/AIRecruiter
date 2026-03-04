from typing import Optional
from sqlalchemy.orm import Session

from app.db.models.certification import Certification


class CertificationCRUD:
    """CRUD operations for Certification model."""

    @staticmethod
    def create_certification(
        db: Session,
        candidate_profile_id: str,
        certification_data: dict
    ) -> Certification:
        db_cert = Certification(
            candidate_profile_id=candidate_profile_id,
            **certification_data
        )
        db.add(db_cert)
        db.commit()
        db.refresh(db_cert)
        return db_cert

    @staticmethod
    def get_certification_by_id(
        db: Session,
        certification_id: str
    ) -> Optional[Certification]:
        return (
            db.query(Certification)
            .filter(Certification.id == certification_id)
            .first()
        )

    @staticmethod
    def get_certifications_by_candidate(
        db: Session,
        candidate_profile_id: str,
        skip: int = 0,
        limit: int = 100
    ) -> list[Certification]:
        return (
            db.query(Certification)
            .filter(Certification.candidate_profile_id == candidate_profile_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def update_certification(
        db: Session,
        certification_id: str,
        certification_data: dict
    ) -> Optional[Certification]:
        db_cert = CertificationCRUD.get_certification_by_id(db, certification_id)
        if not db_cert:
            return None

        for key, value in certification_data.items():
            if value is not None:
                setattr(db_cert, key, value)

        db.add(db_cert)
        db.commit()
        db.refresh(db_cert)
        return db_cert

    @staticmethod
    def delete_certification(
        db: Session,
        certification_id: str
    ) -> bool:
        db_cert = CertificationCRUD.get_certification_by_id(db, certification_id)
        if not db_cert:
            return False

        db.delete(db_cert)
        db.commit()
        return True
