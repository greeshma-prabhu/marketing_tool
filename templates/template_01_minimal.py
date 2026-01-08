"""Template 01: Minimal - Photo frame style with elegant border."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from typing import Dict


class Template01Minimal(BaseTemplate):
    """Minimal template - photo frame style."""
    
    template_id = "template_01"
    template_name = "Minimal"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 60,
            "intro": 200,
            "usp_1": 80,
            "usp_2": 80,
            "usp_3": 80
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3]
        for usp in usps:
            if usp:
                usps_html += f'<div class="feature-item"><div class="dot"></div><p>{usp}</p></div>'
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{product_name}</title>
    <style>
        {self.get_css()}
        * {{ box-sizing: border-box; }}
        body {{ font-family: 'Playfair Display', Georgia, serif; margin: 0; background: #fafafa; }}
        .frame {{ border: 40px solid #2c3e50; margin: -20mm; min-height: 100vh; background: white; padding: 60px 50px; }}
        .title {{ font-size: 48pt; font-weight: 700; color: #2c3e50; margin: 0 0 35px 0; line-height: 1.1; letter-spacing: -1px; }}
        .intro {{ font-size: 16pt; color: #5a6c7d; line-height: 2; margin: 0 0 50px 0; max-width: 85%; }}
        .features {{ margin: 50px 0; }}
        .feature-item {{ display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }}
        .dot {{ width: 12px; height: 12px; background: #2c3e50; border-radius: 50%; flex-shrink: 0; }}
        .feature-item p {{ font-size: 15pt; color: #34495e; margin: 0; line-height: 1.8; }}
    </style>
</head>
<body>
    <div class="frame">
        <h1 class="title">{copy.title}</h1>
        <div class="intro">{copy.intro}</div>
        <div class="features">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html
