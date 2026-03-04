from app.db.crud.user import UserCRUD
from app.db.crud.job_description import JobDescriptionCRUD
from app.db.crud.candidate_profile import CandidateProfileCRUD
from app.db.crud.education import EducationCRUD
from app.db.crud.work_experience import WorkExperienceCRUD
from app.db.crud.certification import CertificationCRUD

__all__ = [
    "UserCRUD",
    "JobDescriptionCRUD",
    "CandidateProfileCRUD",
    "EducationCRUD",
    "WorkExperienceCRUD",
    "CertificationCRUD",
]
