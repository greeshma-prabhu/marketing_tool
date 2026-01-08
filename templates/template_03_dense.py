"""Template 03: Dense - Infographic style."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from typing import Dict


class Template03Dense(BaseTemplate):
    """Dense template - infographic style."""
    
    template_id = "template_03"
    template_name = "Dense"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 80,
            "intro": 300,
            "usp_1": 100,
            "usp_2": 100,
            "usp_3": 100,
            "usp_4": 100,
            "usp_5": 100
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"]
        usps = [copy.usp_1, copy.usp_2, copy.usp_3, copy.usp_4, copy.usp_5]
        for i, usp in enumerate(usps):
            if usp:
                color = colors[i % len(colors)]
                usps_html += f'''
                <div class="info-card" style="border-left: 8px solid {color};">
                    <div class="card-number" style="color: {color};">{i+1}</div>
                    <p>{usp}</p>
                </div>'''
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{product_name}</title>
    <style>
        {self.get_css()}
        * {{ box-sizing: border-box; }}
        body {{ font-family: 'Roboto', 'Arial', sans-serif; margin: 0; background: #ecf0f1; }}
        .container {{ background: white; margin: -20mm; padding: 50px 45px; }}
        .header {{ border-bottom: 6px solid #34495e; padding-bottom: 25px; margin-bottom: 35px; }}
        .title {{ font-size: 44pt; font-weight: 900; color: #2c3e50; margin: 0; line-height: 1; text-transform: uppercase; }}
        .intro {{ font-size: 15pt; color: #7f8c8d; line-height: 1.9; margin: 30px 0 45px 0; columns: 2; column-gap: 40px; text-align: justify; }}
        .info-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }}
        .info-card {{ background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; gap: 20px; align-items: start; }}
        .card-number {{ font-size: 48pt; font-weight: 900; line-height: 1; flex-shrink: 0; }}
        .info-card p {{ font-size: 13pt; color: #34495e; margin: 0; line-height: 1.7; flex: 1; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">{copy.title}</h1>
        </div>
        <div class="intro">{copy.intro}</div>
        <div class="info-grid">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html
