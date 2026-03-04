import os
import tempfile
import traceback

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

# Brand colours
COLOR_MAROON = (0x73/255, 0x22/255, 0x3B/255)
COLOR_ORANGE = (0xF3/255, 0x73/255, 0x1F/255)
COLOR_DARK   = (0x33/255, 0x33/255, 0x33/255)

PAGE_W, PAGE_H = letter
M_LEFT  = 72
M_RIGHT = 72
CONTENT_W = PAGE_W - M_LEFT - M_RIGHT


def _fill(c, rgb):
    c.setFillColorRGB(*rgb)

def draw_colored_bullet_line(
    c, x, y, text,
    bullet_rgb,
    text_rgb=None,
    font="Helvetica",
    size=10
):
    box_size = 6

    # Bullet
    c.setFillColorRGB(*bullet_rgb)
    c.rect(x, y - 4, box_size, box_size, fill=1, stroke=0)

    # Text color (default = dark)
    if text_rgb is None:
        text_rgb = COLOR_DARK

    c.setFillColorRGB(*text_rgb)
    c.setFont(font, size)
    c.drawString(x + box_size + 6, y, text)

    return y - 14


# ─────────────────────────────────────────────
# PAGE 1
# ─────────────────────────────────────────────

def page1(c, data):
    personal = data.get("personalInfo", {})
    y = PAGE_H - 72

    # NAME
    name = personal.get("name","").upper()
    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(M_LEFT, y, name)
    y -= 34

    # TITLE
    title = personal.get("title","").upper()
    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica", 11)
    for tl in simpleSplit(title, "Helvetica", 11, CONTENT_W):
        c.drawString(M_LEFT, y, tl)
        y -= 15
    y -= 6

    # QUOTE
    quote = personal.get("quote","").strip()
    if quote:
        _fill(c, COLOR_ORANGE)
        c.setFont("Helvetica-Oblique", 10)
        for ql in simpleSplit(quote, "Helvetica-Oblique", 10, CONTENT_W):
            c.drawString(M_LEFT, y, ql)
            y -= 14
        y -= 6

    # Separator
    c.setStrokeColorRGB(*COLOR_MAROON)
    c.setLineWidth(0.8)
    c.line(M_LEFT, y, PAGE_W - M_RIGHT, y)
    y -= 16

    # Columns
    LEFT_W  = 290
    RIGHT_X = M_LEFT + LEFT_W + 20
    col_top = y

    # ABOUT
    first = (personal.get("name") or "").split()[0]
    label = f"About ({first})" if first else "About"

    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(M_LEFT, y, label)
    y -= 18

    summary = personal.get("summary","").strip()
    if summary:
        _fill(c, COLOR_DARK)
        c.setFont("Helvetica", 9)
        for line in simpleSplit(summary, "Helvetica", 9, LEFT_W):
            c.drawString(M_LEFT, y, line)
            y -= 13
    y -= 12

    # RIGHT COLUMN
    ry = col_top

    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(RIGHT_X, ry, "Languages")
    ry -= 18

    _fill(c, COLOR_DARK)
    c.setFont("Helvetica", 9)
    for lang in data.get("languages", []):
        c.drawString(RIGHT_X + 4, ry, f"\u2022 {lang.strip()}")
        ry -= 13
    ry -= 12

    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(RIGHT_X, ry, "Interests")
    ry -= 18

    _fill(c, COLOR_DARK)
    c.setFont("Helvetica", 9)
    for hobby in data.get("hobbies", []):
        c.drawString(RIGHT_X + 4, ry, f"\u2022 {hobby.strip()}")
        ry -= 13

    y = min(y, ry) - 25

    # EXPERTISE TITLE → MAROON
    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(M_LEFT, y, "Expertise")
    c.line(M_LEFT, y - 3, PAGE_W - M_RIGHT, y - 3)
    y -= 26

    skills_dict = data.get("skills", {})
    CAT_LABELS = [
        ('project_management', 'Project Management'),
        ('technical',          'Technical'),
        ('devops',             'DevOps'),
        ('domains',            'Domains'),
    ]

    for key, label in CAT_LABELS:
        items = [i.strip() for i in skills_dict.get(key, []) if i.strip()]
        if not items:
            continue

        box_size = 6

        # Bullet (ORANGE)
        c.setFillColorRGB(*COLOR_MAROON)
        c.rect(M_LEFT, y - 4, box_size, box_size, fill=1, stroke=0)

        text_x = M_LEFT + box_size + 6

        # Draw label (ORANGE)
        c.setFillColorRGB(*COLOR_MAROON)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(text_x, y, f"{label}: ")

        # Measure label width so skills start right after it
        label_width = c.stringWidth(f"{label}: ", "Helvetica-Bold", 10)

        # Draw skills (BLACK)
        c.setFillColorRGB(*COLOR_DARK)
        c.setFont("Helvetica", 10)
        c.drawString(text_x + label_width, y, ", ".join(items))

        y -= 18

# ─────────────────────────────────────────────
# EXPERIENCE
# ─────────────────────────────────────────────

def experience_pages(c, data):
    experience = data.get("experience", [])
    if not experience:
        return

    c.showPage()
    y = PAGE_H - 72
    STOP_Y = 60

    # TITLE → MAROON
    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(M_LEFT, y, "Project Experience")
    c.line(M_LEFT, y - 3, PAGE_W - M_RIGHT, y - 3)
    y -= 28

    for exp in experience:

        role     = exp.get("role","").strip()
        company  = exp.get("company","").strip()
        duration = exp.get("duration","").strip()

        header = role
        if company:
            header += f" | {company}"
        if duration:
            header += f" ({duration})"

        if y < STOP_Y + 60:
            c.showPage()
            y = PAGE_H - 72

        # INNER ROLE BULLET → ORANGE
        y = draw_colored_bullet_line(
            c, M_LEFT, y, header,
            bullet_rgb=COLOR_MAROON,
            text_rgb=COLOR_MAROON,
            font="Helvetica-Bold", size=11
        )

        resp = exp.get("responsibilities", [])
        items = [str(r).strip() for r in resp if str(r).strip()]

        if items:
            summary = " ".join(items[:10])
            _fill(c, COLOR_DARK)
            c.setFont("Helvetica", 9)

            lines = simpleSplit(summary, "Helvetica", 9, CONTENT_W - 10)
            for ln in lines:
                c.drawString(M_LEFT + 10, y, ln)
                y -= 13

        y -= 14


# ─────────────────────────────────────────────
# EDUCATION + PERSONAL + CERTIFICATIONS
# ─────────────────────────────────────────────

def education_page(c, data):

    education = data.get("education", [])
    certifications = data.get("certifications", [])
    personal = data.get("personalInfo", {})

    c.showPage()
    y = PAGE_H - 72

    # EDUCATION TITLE
    _fill(c, COLOR_MAROON)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(M_LEFT, y, "Education")
    c.line(M_LEFT, y - 3, PAGE_W - M_RIGHT, y - 3)
    y -= 26

    for edu in education:
        parts = []
        if edu.get("degree"): parts.append(edu["degree"])
        if edu.get("institution"): parts.append(edu["institution"])
        if edu.get("year"): parts.append(f"({edu['year']})")

        line = " – ".join(parts)
        if edu.get("specialization"):
            line += f" | {edu['specialization']}"

        if line:
            # BULLET → MAROON
            y = draw_colored_bullet_line(
                c, M_LEFT, y, line,
                COLOR_MAROON, size=10
            )

    y -= 10

    # PERSONAL DETAILS TITLE
    details = [
        ("Date of Birth", personal.get("dob","")),
        ("Gender", personal.get("gender","")),
        ("Nationality", personal.get("nationality","")),
        ("Marital Status", personal.get("marital_status","")),
        ("Passport", personal.get("passport","")),
        ("Location", personal.get("location","")),
    ]

    non_empty = [(k,v) for k,v in details if v]

    if non_empty:
        _fill(c, COLOR_MAROON)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(M_LEFT, y, "Personal Details")
        c.line(M_LEFT, y - 3, PAGE_W - M_RIGHT, y - 3)
        y -= 26

        for label, value in non_empty:
            y = draw_colored_bullet_line(
                c, M_LEFT, y,
                f"{label}: {value}",
                COLOR_MAROON, size=10
            )

    y -= 10

    # CERTIFICATIONS TITLE
    if certifications:
        _fill(c, COLOR_MAROON)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(M_LEFT, y, "Certifications")
        c.line(M_LEFT, y - 3, PAGE_W - M_RIGHT, y - 3)
        y -= 26

        for cert in certifications:
            if cert.strip():
                y = draw_colored_bullet_line(
                    c, M_LEFT, y,
                    cert.strip(),
                    COLOR_MAROON, size=10
                )


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def generate_synpulse_resume(data: dict) -> str:
    try:
        out = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        path = out.name
        out.close()

        c = canvas.Canvas(path, pagesize=letter)
        c.setTitle(data.get("personalInfo",{}).get("name","Resume"))

        page1(c, data)
        experience_pages(c, data)
        education_page(c, data)

        c.save()
        return path

    except Exception:
        traceback.print_exc()
        raise


