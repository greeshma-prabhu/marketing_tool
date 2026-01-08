"""Template 08: Bold - High contrast with feature visuals."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from core.image_generator import generate_feature_icon, get_feature_image_url
from typing import Dict


class Template08Bold(BaseTemplate):
    """Bold template - high contrast design."""
    
    template_id = "template_08"
    template_name = "Bold"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 70,
            "intro": 240,
            "usp_1": 95,
            "usp_2": 95,
            "usp_3": 95,
            "usp_4": 95,
            "usp_5": 95
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3, copy.usp_4, copy.usp_5]
        colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]
        
        for i, usp in enumerate(usps):
            if usp:
                color = colors[i % len(colors)]
                icon = generate_feature_icon(usp)
                image_url = get_feature_image_url(usp, product_name)
                usps_html += f'''
                <div class="bold-card" style="border-left: 8px solid {color};">
                    <div class="card-visual">
                        <div class="visual-icon" style="color: {color};">{icon}</div>
                        <img src="{image_url}" alt="Feature {i+1}" class="visual-img" />
                    </div>
                    <div class="card-text">
                        <div class="card-number" style="background: {color};">{i+1}</div>
                        <p>{usp}</p>
                    </div>
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
        body {{ font-family: 'Impact', 'Arial Black', sans-serif; margin: 0; background: #000; }}
        .container {{ background: #ffffff; margin: -20mm; padding: 50px 40px; }}
        .title-section {{ background: #000; color: white; padding: 60px 50px; margin: -50px -40px 50px -40px; }}
        .title {{ font-size: 56pt; font-weight: 900; color: #fff; margin: 0 0 20px 0; line-height: 1; text-transform: uppercase; letter-spacing: 4px; }}
        .intro {{ font-size: 18pt; color: #ccc; line-height: 1.8; margin: 0; }}
        .bold-grid {{ display: flex; flex-direction: column; gap: 25px; }}
        .bold-card {{ display: flex; gap: 25px; padding: 30px; background: #f5f5f5; border-radius: 8px; }}
        .card-visual {{ width: 150px; height: 150px; position: relative; flex-shrink: 0; border-radius: 8px; overflow: hidden; }}
        .visual-icon {{ font-size: 60pt; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; opacity: 0.4; }}
        .visual-img {{ width: 100%; height: 100%; object-fit: cover; }}
        .card-text {{ flex: 1; display: flex; align-items: start; gap: 20px; }}
        .card-number {{ width: 50px; height: 50px; border-radius: 50%; color: white; font-size: 24pt; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }}
        .card-text p {{ font-size: 15pt; color: #333; margin: 0; line-height: 1.7; font-weight: 600; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="title-section">
            <h1 class="title">{copy.title}</h1>
            <div class="intro">{copy.intro}</div>
        </div>
        <div class="bold-grid">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html

