import os
import json
import requests
from fastapi import HTTPException, UploadFile

from app.schemas.candidate_profile import PromptRequest, PromptResponse
from app.services.resume_assist import process_uploaded_file as resume_text_extract

api_key = os.getenv("GROQ_API_KEY")
api_url = "https://api.groq.com/openai/v1/chat/completions"


def ask_ai(prompt: PromptRequest) -> PromptResponse:
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Groq API key not configured",
        )
    
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a all-in-one AI assistant for hiring platform"
                    "Strict rules : : : Output : No extra text, no markdown, no explanations, no symbols. Just answer the question asked by user."
                    "Answer anything that user ask related to hiring, candidates, job descriptions, resume parsing, resume matching etc. "
                ),
            },
            {"role": "user", "content": prompt.prompt},
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
        return PromptResponse(
            prompt=prompt.prompt,
            response=content
        )


    except requests.RequestException as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API request failed: {exc}",
        )

