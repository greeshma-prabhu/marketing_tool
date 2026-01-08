"""Template 02: Modern - Magazine cover style."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from typing import Dict


class Template02Modern(BaseTemplate):
    """Modern template - magazine cover style."""
    
    template_id = "template_02"
    template_name = "Modern"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 70,
            "intro": 250,
            "usp_1": 90,
            "usp_2": 90,
            "usp_3": 90,
            "usp_4": 90
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3, copy.usp_4]
        for usp in usps:
            if usp:
                usps_html += f'<div class="highlight-box"><p>{usp}</p></div>'
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{product_name}</title>
    <style>
        {self.get_css()}
        * {{ box-sizing: border-box; }}
        body {{ font-family: 'Montserrat', 'Arial', sans-serif; margin: 0; }}
        .container {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: -20mm; min-height: 100vh; padding: 80px 60px; position: relative; overflow: hidden; }}
        .container::before {{ content: ''; position: absolute; top: -50%; right: -20%; width: 600px; height: 600px; background: rgba(255,255,255,0.1); border-radius: 50%; }}
        .content {{ position: relative; z-index: 1; }}
        .title {{ font-size: 56pt; font-weight: 900; color: white; margin: 0 0 30px 0; line-height: 1; text-transform: uppercase; letter-spacing: 3px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); }}
        .intro {{ font-size: 18pt; color: rgba(255,255,255,0.95); line-height: 1.9; margin: 0 0 60px 0; font-weight: 300; max-width: 75%; }}
        .highlights {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }}
        .highlight-box {{ background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }}
        .highlight-box p {{ font-size: 15pt; color: #2d3748; margin: 0; line-height: 1.7; font-weight: 600; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1 class="title">{copy.title}</h1>
            <div class="intro">{copy.intro}</div>
            <div class="highlights">{usps_html}</div>
        </div>
    </div>
</body>
</html>
"""
        return html
