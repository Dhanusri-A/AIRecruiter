import os
import requests
import tempfile
import uuid
import json
import docx
from typing import Optional

from fastapi import HTTPException
from docx import Document
from fpdf import FPDF

from app.schemas.job import JobDescriptionCreate

class JobDescriptionGenerator:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")

        if not self.api_key:
            try:
                with open("groq_key.txt", "r") as f:
                    self.api_key = f.read().strip()
            except FileNotFoundError:
                self.api_key = None

        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
    
    def generate_job_description(
        self,
        data: JobDescriptionCreate,
    ) -> dict:
        if not self.api_key:
            raise HTTPException(
                status_code=500,
                detail="Groq API key not configured",
            )

        prompt = self._build_prompt(data)

        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a professional HR content writer. "
                        "Generate clear, structured, and realistic job descriptions "
                        "with headings and bullet points."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 1500,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            response = requests.post(
                self.api_url,
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


    def _build_prompt(self, data: JobDescriptionCreate) -> str:
        return f"""
You MUST respond with ONLY valid JSON.
DO NOT include explanations, markdown, or extra text.

Return JSON in EXACTLY this format:

{{
  "about_the_role": "string",
  "key_responsibilities": ["string"],
  "qualities_and_requirements": ["string"],
  "benefits_and_perks": ["string"],
  "about_us": "string"
}}

Use the following job details to generate the content.

Job Title: {data.job_title}
Company Name: {data.company_name}
Department: {data.department or "N/A"}
Location: {data.location or "N/A"}
Experience Level: {data.level or "Not specified"}
Tone / Style: {data.tone_style or "Professional"}
Skills: {data.skills or "Suggest appropriate skills"}
Responsibilities: {data.responsibilities or "Define responsibilities"}
Additional Context: {data.additional_data or "None"}
Input Description: {data.input_description or "None"}

Rules:
- JSON only
- No markdown
- No comments
- Arrays must contain 4–7 items where applicable
- Give quite large content and it must looks like professional job description
"""


    def save_to_word(self, text: str, filename: Optional[str] = None) -> str:
        """Save job description to Word document and return file path"""
        if not filename:
            filename = f"Job_Description_{uuid.uuid4().hex[:8]}.docx"
        
        doc = Document()
        doc.add_heading("Job Description", level=1)
        doc.add_paragraph(text)
        
        # Save to temporary file
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        doc.save(file_path)
        
        return file_path
    
    def save_to_pdf(self, text: str, filename: Optional[str] = None) -> str:
        """Save job description to PDF and return file path"""
        if not filename:
            filename = f"Job_Description_{uuid.uuid4().hex[:8]}.pdf"
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        for line in text.split('\n'):
            if line.strip():  # Skip empty lines
                pdf.multi_cell(0, 10, line)
        
        # Save to temporary file
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        pdf.output(file_path)
        
        return file_path

job_generator = JobDescriptionGenerator()

