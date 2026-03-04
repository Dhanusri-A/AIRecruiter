import enum

class CandidateStatus(str, enum.Enum):
    SOURCED = "sourced"
    MATCHED = "matched"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    HIRED = "hired"