"""PDF rendering engine using WeasyPrint."""
from weasyprint import HTML, CSS
from pathlib import Path
from typing import Optional
from templates.base import BaseTemplate
from core.copy_generator import CopySlots
from config.settings import settings


def render_pdf(
    template: BaseTemplate,
    copy: CopySlots,
    product_name: str,
    output_path: Optional[str] = None
) -> bytes:
    """
    Render PDF from template and copy.
    
    Args:
        template: Template instance
        copy: CopySlots with generated copy
        product_name: Product/service name
        output_path: Optional path to save PDF (if None, returns bytes)
    
    Returns:
        PDF bytes
    """
    # Generate HTML
    html_content = template.render_html(copy, product_name)
    
    # Create HTML object
    html = HTML(string=html_content)
    
    # Generate CSS
    css = CSS(string=template.get_css())
    
    # Render PDF
    pdf_bytes = html.write_pdf(stylesheets=[css])
    
    # Save if output path provided
    if output_path:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)
    
    return pdf_bytes

