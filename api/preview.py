"""Template preview generation for frontend."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from templates.base import BaseTemplate
from core.copy_generator import CopySlots
from templates.template_01_minimal import Template01Minimal
from templates.template_02_modern import Template02Modern
from templates.template_03_dense import Template03Dense
from templates.template_04_corporate import Template04Corporate
from templates.template_05_creative import Template05Creative
from templates.template_06_tech import Template06Tech
from templates.template_07_elegant import Template07Elegant
from templates.template_08_bold import Template08Bold
from templates.template_09_minimalist import Template09Minimalist
from templates.template_10_showcase import Template10Showcase

def get_template(template_id: str):
    """Get template instance by ID."""
    templates = {
        "template_01": Template01Minimal,
        "template_02": Template02Modern,
        "template_03": Template03Dense,
        "template_04": Template04Corporate,
        "template_05": Template05Creative,
        "template_06": Template06Tech,
        "template_07": Template07Elegant,
        "template_08": Template08Bold,
        "template_09": Template09Minimalist,
        "template_10": Template10Showcase,
    }
    template_class = templates.get(template_id, Template01Minimal)
    return template_class()

router = APIRouter()


class PreviewRequest(BaseModel):
    template_id: str
    sample_data: Optional[dict] = None


@router.post("/api/templates/preview", tags=["Templates"])
async def generate_preview(request: PreviewRequest):
    """Generate a preview HTML for a template."""
    try:
        template = get_template(request.template_id)
        
        # Use sample data or defaults
        sample_copy = CopySlots(
            title=request.sample_data.get("title", "Sample Product Title") if request.sample_data else "Sample Product Title",
            intro=request.sample_data.get("intro", "This is a sample introduction text to show how the template looks. It demonstrates the layout and styling.") if request.sample_data else "This is a sample introduction text to show how the template looks. It demonstrates the layout and styling.",
            usp_1=request.sample_data.get("usp_1", "Key Feature One") if request.sample_data else "Key Feature One",
            usp_2=request.sample_data.get("usp_2", "Key Feature Two") if request.sample_data else "Key Feature Two",
            usp_3=request.sample_data.get("usp_3", "Key Feature Three") if request.sample_data else "Key Feature Three",
            usp_4=request.sample_data.get("usp_4", None) if request.sample_data else None,
            usp_5=request.sample_data.get("usp_5", None) if request.sample_data else None
        )
        
        html = template.render_html(sample_copy, "Sample Product")
        
        return {"html": html, "template_id": request.template_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

