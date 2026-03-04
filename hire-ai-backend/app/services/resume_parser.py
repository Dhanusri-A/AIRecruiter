import os
import json
import requests
from fastapi import HTTPException, UploadFile

from app.services.resume_assist import process_uploaded_file as resume_text_extract

api_key = os.getenv("GROQ_API_KEY")
api_url = "https://api.groq.com/openai/v1/chat/completions"


def parse_resume(file: UploadFile) -> dict:
    resume_text: str = resume_text_extract(file)

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Groq API key not configured",
        )

    prompt = build_prompt(resume_text)

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a resume parsing expert. "
                    "Extract structured information from resumes. "
                    "Return ONLY valid JSON. No markdown. No explanations."
                    "Take your time, extract thoroughly and give correct data"
                ),
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.1,
        "max_tokens": 2000,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            timeout=30,
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text,
            )

        content = response.json()["choices"][0]["message"]["content"]

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="LLM returned invalid JSON",
            )

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API request failed: {exc}",
        )


def build_prompt(text: str) -> str:
    return f"""
MUST respond with ONLY valid JSON.
NO markdown.
NO comments.
NO explanations.

Return JSON in EXACTLY this format:

{{
  "first_name": "",
  "last_name": "",
  "email": "",
  "title": "",
  "phone": "",
  "location": "",
  "skills": "",
  "profile_summary": "",  # MUST TAKE WHOLE SUMMARY FROM RESUME TEXT
  "total_years_experience": "",
  "notice_period": "",
  "expected_salary": "",
  "preferred_mode": "",
  "profiles": {{
    "linkedin": "",    # LIST PROFILES THAT ARE MENTIONED IN RESUME TEXT
    "github": ""
  }},
  "languages": {{
    "english": "",    # LIST LANGUAGES THAT ARE MENTIONED IN RESUME TEXT
    "hindi": ""
  }},
  "education":[ {{
    "institution_name": "",
    "degree": "",
    "field_of_study": "",
    "start_year": "",
    "end_year": "",
    "gpa": "",
    "honors": ""
  }}],
  "work_experience": [{{
    "company_name": "",
    "job_title": "",
    "start_date": "",
    "end_date": "",
    "location": "",
    "description": ""
  }}],
   "certifications":[ {{
    "certification_name": "",
    "certification_description":""
    "issuing_body": "",  (optional)
    "credential_id": "",  (optional)
    "verification_url": "",  (optional)
    "issue_date": "",  
    "expiry_date": "",   (optional)
    "status": "",   (optional)
    "certificate_file": "",   (optional)
  }}]
}}

STRICT RULES:
- Missing values must be empty strings
- Do NOT invent data
- Do NOT use the word "Unknown"
- Only extract what exists

Resume Text:
{text}
""".strip()
