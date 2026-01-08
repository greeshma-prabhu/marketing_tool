"""Template 04: Corporate - Large typography minimalist."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from typing import Dict


class Template04Corporate(BaseTemplate):
    """Corporate template - large typography style."""
    
    template_id = "template_04"
    template_name = "Corporate"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 70,
            "intro": 280,
            "usp_1": 100,
            "usp_2": 100,
            "usp_3": 100
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3]
        for usp in usps:
            if usp:
                usps_html += f'<div class="benefit"><p>{usp}</p></div>'
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{product_name}</title>
    <style>
        {self.get_css()}
        * {{ box-sizing: border-box; }}
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; }}
        .container {{ background: #ffffff; margin: -20mm; padding: 70px 60px; }}
        .title-section {{ margin-bottom: 60px; }}
        .title {{ font-size: 64pt; font-weight: 100; color: #1a1a1a; margin: 0 0 20px 0; line-height: 1; letter-spacing: -2px; }}
        .intro {{ font-size: 20pt; color: #666; line-height: 1.8; margin: 0; font-weight: 300; max-width: 80%; }}
        .benefits {{ display: flex; flex-direction: column; gap: 40px; margin-top: 80px; }}
        .benefit {{ border-top: 1px solid #e0e0e0; padding-top: 30px; }}
        .benefit p {{ font-size: 18pt; color: #333; margin: 0; line-height: 1.8; font-weight: 400; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="title-section">
            <h1 class="title">{copy.title}</h1>
            <div class="intro">{copy.intro}</div>
        </div>
        <div class="benefits">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html
