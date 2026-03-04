import os
import json
import tempfile
from pptx import Presentation
from pptx.util import Pt
from pptx.enum.text import MSO_AUTO_SIZE
from pptx.dml.color import RGBColor
import tempfile
import json_repair



import requests

from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


EXTRACTION_PROMPT = """
Extract the following information from the resume text into a JSON object.

STRICT RULES:
- Return ONLY valid JSON (no markdown, no text)
- DO NOT invent information
- DO NOT use the word "Unknown"
- Missing values must be empty strings or empty arrays

JSON STRUCTURE:
{{
  "personalInfo": {{
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "summary": "",   # MUST INCLUDE WHOLE SUMMARY FROM RESUME TEXT
    "quote": "",
    "dob": "",              // "July 25, 1984"
    "gender": "",           // "Male"
    "nationality": "",      // "Indian"
    "marital_status": "",   // "Single"
    "passport": "",         // "Yes"
    "current_location": ""  // "Noida, Uttar Pradesh"
  }},
  "certifications": [         // NEW: Certifications only
    ""
  ],
  "experience": [
    {{
      "company": "",
      "role": "",
      "duration": "",
      "responsibilities": []
    }}
  ],
  "education": [
    {{
      "degree": "",
      "institution": "",
      "year": ""
    }}
  ],
  "skills": {{
    "project_management": [],
    "technical": [],
    "devops": [],
    "domains": []
  }},
  "languages": [],
  "hobbies": []
}}

Resume Text:
{text}
"""

# ───────────────────────────────────────────────
# SAFE JSON PARSER
# ───────────────────────────────────────────────
def safe_json_extract(text: str) -> dict:
    print("\n--- RAW BEFORE CLEAN ---")
    print(repr(text))

    text = text.strip()

    # Remove code fences if present
    if text.startswith("```"):
        first_newline = text.find('\n')
        if first_newline != -1:
            text = text[first_newline + 1:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

    print("\n--- RAW AFTER STRIP ---")
    print(repr(text))

    # Case 1: starts directly with object
    if text.startswith("{"):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

    # Case 2: starts with "personalInfo" without opening brace
    if text.startswith('"personalInfo"'):
        end = text.rfind("}")
        if end != -1:
            wrapped = "{" + text[:end + 1]
        else:
            wrapped = "{" + text + "}"
        print("\n--- WRAPPED JSON ---")
        print(wrapped)
        try:
            return json.loads(wrapped)
        except json.JSONDecodeError:
            pass

    # Case 3: find outermost { ... }
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        candidate = text[start:end]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            print("Failed to parse extracted block:", repr(candidate[:300]))

    # Last resort: try the whole cleaned string
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print("Final JSON parse attempt failed:", str(e))

    raise ValueError(f"No valid JSON could be extracted. Text starts with: {text[:80]!r}")


def get_default_resume_data():
    return {
        "personalInfo": {
            "name": "",
            "title": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "summary": "",
            "quote": "",
            "dob": "",
            "gender": "",
            "nationality": "",
            "marital_status": "",
            "passport": "",
            "current_location": ""
        },
        "certifications": [],
        "experience": [],
        "education": [],
        "skills": {
            "project_management": [],
            "technical": [],
            "devops": [],
            "domains": []
        },
        "languages": [],
        "hobbies": []
    }


def validate_and_fill_defaults(data: dict) -> dict:
    defaults = get_default_resume_data()

    # Merge top-level keys
    for k, v in defaults.items():
        if k not in data or data[k] is None:
            data[k] = v.copy() if isinstance(v, dict) else v

    # Force certifications to be list
    data["certifications"] = data.get("certifications", []) or []

    # Clean education
    clean_edu = []
    for e in data.get("education", []):
        if isinstance(e, dict):
            if e.get("degree") and e.get("year"):
                if "unknown" not in str(e).lower():
                    clean_edu.append(e)
    data["education"] = clean_edu

    # Ensure skill sub-keys exist
    if "skills" not in data or not isinstance(data["skills"], dict):
        data["skills"] = defaults["skills"].copy()

    for k in defaults["skills"]:
        if k not in data["skills"]:
            data["skills"][k] = []

    # Force lists
    data["hobbies"] = data.get("hobbies") or []
    data["languages"] = data.get("languages") or []

    print("\n=== FINAL CLEAN DATA ===")
    print(json.dumps(data, indent=2))
    return data


def extract_resume_data(text: str) -> dict:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not configured")

    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": [
            {
                "role": "system",
                "content": "You are a resume parsing expert. Return ONLY valid JSON."
            },
            {
                "role": "user",
                "content": EXTRACTION_PROMPT.format(text=text)
            }
        ],
        "temperature": 0.1,
        "max_tokens": 4000,
        "response_format": {"type": "json_object"},
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload,
            timeout=30,
        )

        if response.status_code != 200:
            raise RuntimeError(response.text)

        raw = response.json()["choices"][0]["message"]["content"]
        if not raw.strip().endswith("}"):
            raise ValueError("Model output appears truncated.")
        # data = safe_json_extract(raw)
        data = json_repair.loads(raw)
        return data

    except Exception as exc:
        print("❌ GROQ EXTRACTION ERROR:", exc)
        return get_default_resume_data()