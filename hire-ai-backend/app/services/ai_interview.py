import os
import json
import time
import requests
from typing import Dict
from fastapi import HTTPException

from datetime import datetime, timedelta, date, timezone

api_key = os.getenv("GROQ_API_KEY")
api_url = "https://api.groq.com/openai/v1/chat/completions"


def generate_questions(job_title: str) -> Dict:
    prompt = f"""
You are an interview assistant.

Generate exactly three technical interview questions for the job title below and append from question 2.
STRICT : TOTALLY RETURN 4 QUESTIONS IN RESPONSE, MUST USE DEFAULT QUESTION GIVEN IN JSON OBJECT FOR QUESTION 1

IMPORTANT: Any response that includes objects inside "questions" is INVALID.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No extra text
- questions MUST be an array of STRINGS
- DO NOT return objects
- DO NOT include difficulty
- DO NOT use keys like "question" or "difficulty"

If you violate the format, the response is invalid.

Return format (EXACT):
{{
  "job_title": "{job_title}",
  "questions": [
    "Question 1",  # USE "Give a brief introduction about yourself?" as Question 1 always
    "Question 2",
    "Question 3",
    "Question 4"
  ]
}}

Job Title:
{job_title}
"""

    return call_llm(prompt)


def evaluate_answers(job_title: str, qa: list[Dict]) -> Dict:
    prompt = f"""
You are an interview evaluator.

IMPORTANT: Give summary little larger like more than 20 words for every summary.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No extra text

Scoring:
- Score between 0 and 100
- Partial credit allowed

Return format (EXACT):
{{
  "score": number,
  "ai_summary": {{
    "overall_summary": "string",
    "question_wise": [
      {{
        "question": "string",
        "summary": "string"
      }}
    ]
  }}
}}

Job Title:
{job_title}

Questions and Answers:
{json.dumps(qa, indent=2)}
"""
    return call_llm(prompt)



def call_llm(prompt: str) -> Dict:
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
              "role": "system",
              "content": "You are a strict JSON-only API. You MUST follow the user's JSON schema exactly. Do not infer or extend schemas."
              "Take your time, read thoroughly and give response."
            },

            {"role": "user", "content": prompt},
        ],
        "temperature": 0.3,
        "max_tokens": 800,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    for attempt in range(3):
        response = requests.post(api_url, headers=headers, json=payload, timeout=30)
        if response.status_code != 429:
            break
        time.sleep(2 ** attempt)

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"LLM error: {response.text}",
        )

    content = response.json()["choices"][0]["message"]["content"]

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="LLM returned invalid JSON",
        )






def validate_interview_time(db_interview):
    if not db_interview.date or not db_interview.time:
        raise ValueError("Interview schedule is invalid")

    now = datetime.now(timezone.utc)

    interview_start = datetime.combine(
        db_interview.date,
        db_interview.time
    ).replace(tzinfo=timezone.utc)
    interview_end = interview_start + timedelta(minutes=30)

    if now < interview_start or now > interview_end:
        raise ValueError("Interview expired or not yet started")

    # If you reach here, access is allowed
    return True
