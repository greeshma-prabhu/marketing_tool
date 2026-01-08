"""Template 05: Creative - Bold poster style."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from typing import Dict


class Template05Creative(BaseTemplate):
    """Creative template - bold poster style."""
    
    template_id = "template_05"
    template_name = "Creative"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 75,
            "intro": 250,
            "usp_1": 95,
            "usp_2": 95,
            "usp_3": 95,
            "usp_4": 95
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"]
        rotations = [-3, 2, -2, 3]
        usps = [copy.usp_1, copy.usp_2, copy.usp_3, copy.usp_4]
        for i, usp in enumerate(usps):
            if usp:
                color = colors[i % len(colors)]
                rotation = rotations[i % len(rotations)]
                usps_html += f'''
                <div class="poster-card" style="background: {color}; transform: rotate({rotation}deg);">
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
        body {{ font-family: 'Impact', 'Arial Black', sans-serif; margin: 0; background: #f0f0f0; }}
        .container {{ background: #ffffff; margin: -20mm; padding: 0; min-height: 100vh; position: relative; }}
        .title-banner {{ background: linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%); padding: 100px 70px 80px 70px; transform: rotate(-1.5deg); margin: -30px -70px 70px -70px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }}
        .title {{ font-size: 58pt; font-weight: 900; color: white; margin: 0; line-height: 1; text-transform: uppercase; letter-spacing: 2px; text-shadow: 5px 5px 0px rgba(0,0,0,0.3); }}
        .content {{ padding: 0 70px 70px 70px; }}
        .intro {{ font-size: 19pt; color: #2d3748; line-height: 1.9; margin: 0 0 60px 0; font-weight: 700; }}
        .poster-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }}
        .poster-card {{ padding: 50px 35px; border-radius: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }}
        .poster-card p {{ font-size: 17pt; color: white; margin: 0; line-height: 1.6; font-weight: 900; text-shadow: 3px 3px 6px rgba(0,0,0,0.3); text-align: center; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="title-banner">
            <h1 class="title">{copy.title}</h1>
        </div>
        <div class="content">
            <div class="intro">{copy.intro}</div>
            <div class="poster-grid">{usps_html}</div>
        </div>
    </div>
</body>
</html>
"""
        return html
