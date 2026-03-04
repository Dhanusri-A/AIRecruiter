from fastapi import HTTPException
import httpx
from app.core.config import SERPER_API_KEY

import os
import json
import requests

async def search_google_profiles(job_title: str, location: str, source: str):
    # Mapping sources to specific domains
    site_map = {
        "linkedin": "linkedin.com/in/",
        "naukri": "naukri.com/n/",
        "indeed": "site:indeed.com",
        "github": "site:github.com",
    }
    domain = site_map.get(source.lower(), "linkedin.com/in/")
    
    # Construct query
    query = f'site:{domain} "{job_title}" "{location}"'
    
    url = "https://google.serper.dev/search"
    headers = {
        'X-API-KEY': SERPER_API_KEY, # Get this free from serper.dev
        'Content-Type': 'application/json'
    }
    payload = {"q": query}
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()

            # Serper returns results in the 'organic' key
            results = []
            for item in data.get("organic", []):
                results.append({
                    "title": item.get("title"),
                    "link": item.get("link"),
                    "snippet": item.get("snippet")
                })
            return results
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json()
        )
    



api_key = os.getenv("GROQ_API_KEY")
api_url = "https://api.groq.com/openai/v1/chat/completions"


def parse_people_from_search(results: list[dict]) -> list[dict]:
    """
    Accepts a list of dicts with keys:
    - title
    - link
    - snippet

    Returns ONLY people in structured JSON.
    """

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Groq API key not configured",
        )

    prompt = build_prompt(results)

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a strict information extraction engine. "
                    "You extract structured data from noisy search results. "
                    "You follow rules exactly. "
                    "You return ONLY valid JSON. "
                    "No markdown. No explanations."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.0,
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
            parsed = json.loads(content)
            if not isinstance(parsed, list):
                raise ValueError("Response is not a JSON array")
            return parsed
        except (json.JSONDecodeError, ValueError):
            raise HTTPException(
                status_code=500,
                detail="LLM returned invalid JSON",
            )

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API request failed: {exc}",
        )


def build_prompt(results: list[dict]) -> str:
    return f"""
MUST respond with ONLY valid JSON.
MUST : PLEASE FOLLOW FIELD AND FILTERING RULES
MUST FOLLOW GIVEN OUTPUT FORMAT (FORGET OLD FORMATS)
MUST CONSIDER CANDIDATE PROFILES ONLY
NO markdown.
NO comments.
NO explanations.
NO extra text.

INPUT:
You are given a JSON array of search result objects.
Each object has:
- title
- link
- snippet

GOAL:
Extract ONLY individual PEOPLE.
IGNORE job postings, hiring pages, company pages, recruiter ads,
and aggregated listings like "100 jobs", "careers", or "apply now".

OUTPUT FORMAT (JSON ARRAY): (STRICTLY FOLLOW THIS BELOW FORMAT)

[
  {{
    "name": "",
    "location": "",
    "source": "",
    "job_title": "",
    "company": "",
    "description": ""
  }}
]

FIELD RULES:
- name:
  - Must clearly be a human name
  - If the title does NOT clearly represent a person, SKIP the item
- location:
  - City / region ONLY if explicitly mentioned
  - Empty string if not present
- source:
  - Use the "link" field exactly
- job_title:
  - Current role inferred strictly from title or snippet
  - Empty string if unclear
- description:
  - Short factual text extracted from snippet only
  - Do NOT rewrite or add interpretation

STRICT FILTERING RULES (MANDATORY):
- SKIP THE ITEM if title or snippet contains:
  - "jobs"
  - "careers"
  - "hiring"
  - "apply"
  - "vacancy"
  - "openings"
  - numeric job counts like "100+", "50 jobs"
- SKIP companies, portals, agencies, or job boards
- SKIP recruiter advertisements
- DO NOT invent missing data
- DO NOT infer beyond the text
- Missing values must be empty strings
- DO NOT include duplicate people

ONLY return people who clearly represent an individual professional profile.

INPUT DATA:
{json.dumps(results, ensure_ascii=False, indent=2)}
""".strip()

