# HireAI Backend

An AI-powered recruiter platform backend built with FastAPI and MySQL.

---

## Tech Stack

- **Framework**: FastAPI
- **Database**: MySQL
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT (PyJWT)
- **Password Hashing**: Passlib + bcrypt
- **Validation**: Pydantic
- **API Docs**: Swagger UI & ReDoc (auto-generated)

---

## Project Structure

```
Hire_AI_Backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth_routes.py
│   │       ├── user_routes.py
│   │       ├── jobs_routes.py
│   │       ├── recruiters_routes.py
│   │       └── candidates_routes.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── base.py
│   │   ├── models.py
│   │   └── crud.py
│   └── schemas/
│       ├── user.py
│       ├── job.py
│       ├── candidate.py
│       └── recruiter.py
├── .env
├── .env.example
├── requirements.txt
└── README.md
```

---

## Database Models

### User table
- id (PK)
- email (unique)
- username (unique)
- hashed_password
- role (recruiter | candidate)
- is_active
- created_at
- updated_at

### JobDescription Table
- id: integer, primary key, auto-increment
- job_title: string
- company_name: string
- department: string
- location: string
- level: string
- tone_style: string
- skills: text
- responsibilities: text
- additional_data: text or JSON stored as string
- input_description: text
- created_at: timestamp
- updated_at: timestamp

### CandidateProfile Table
- id: integer, primary key, auto-increment
- user_id: integer, foreign key → users.id, unique
- first_name: string
- last_name: string
- title: string
- image_url: string
- phone: string
- location: string
- skills: text
- profile_summary: text
- total_years_experience: string
- notice_period: string
- expected_salary: string
- preferred_mode: string
- profiles: JSON
- languages: JSON
- created_at: timestamp
- updated_at: timestamp

### Education Table
- id: integer, primary key, auto-increment
- candidate_profile_id: integer, foreign key → candidate_profiles.id
- institution_name: string
- degree: string
- field_of_study: string
- start_year: integer
- end_year: integer
- gpa: string
- honors: string
- created_at: timestamp
- updated_at: timestamp

### WorkExperience Table
- id: integer, primary key, auto-increment
- candidate_profile_id: integer, foreign key → candidate_profiles.id
- company_name: string
- job_title: string
- start_date: datetime, nullable
- end_date: datetime, nullable
- location: string
- description: text
- created_at: timestamp
- updated_at: timestamp

### Certification Table
- id: integer, primary key, auto-increment
- candidate_profile_id: integer, foreign key → candidate_profiles.id
- certification_name: string
- certification_description: string
- issuing_body: string
- credential_id: string
- verification_url: string
- issue_date: datetime
- expiry_date: datetime 
- status: string (active, expired, revoked) 
- certificate_file: string  
- created_at: timestamp
- updated_at: timestamp


### Interview Table
- id : string
- candidate_id : string, foreign key → user.id
- recruiter_id : string, foreign key → user.id 
- candidate_name : string
- candidate_email : string 
- job_title : string
- interview_type : string
- date: date          # YYYY-MM-DD
- time: time          # HH:MM:SS
- duration : string
- meeting_location : string
- notes: string
- score : integer
- ai_summary : string
- created_at : timestamp
- updated_at : timestamp


---


## Setup

### 1. Clone & create virtual environment
```bash
python -m venv .venv
# Windows
.venv\Scripts\Activate.ps1
# Mac/Linux
source .venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment
Copy `.env.example` to `.env` and fill in your values:
```env
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hireai
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Create MySQL database
```sql
CREATE DATABASE hireai;
```

### 5. Run the application
```bash
python app/main.py
# or
uvicorn app.main:app --reload
```

Server: `http://localhost:8000`
Swagger UI: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

---

## Key Design Decisions

- **Soft delete** for users (`is_active = False`) to preserve audit trails; all other resources are hard-deleted.
- **Cascade deletes**: deleting a user removes their candidate profile; deleting a profile removes all education and work experience records.
- **Pagination** via `skip` and `limit` on all list endpoints.
- **Transactions** used throughout CRUD operations for data safety.
- **Roles**: `recruiter` and `candidate` enforced at the model level; full RBAC middleware is ready to be wired in.

---

## User Roles

| Role | Description |
|------|-------------|
| `recruiter` | Can create and manage job postings |
| `candidate` | Has an extended profile with education and work experience |

---

## Security

- Passwords hashed with bcrypt
- JWT tokens with configurable expiry
- CORS middleware enabled (restrict origins in production)
- Input validation via Pydantic
- SQL injection protection via SQLAlchemy ORM


---

## Roadmap

- [ ] JWT route protection on all endpoints
- [ ] Role-based access control (RBAC) middleware
- [ ] Resume / image file upload support
- [ ] Full-text search for jobs and candidates
- [ ] Rate limiting
- [ ] Email notifications
- [ ] Redis caching
- [ ] Analytics dashboard