"""Template 09: Minimalist - Ultra clean with subtle images."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from core.image_generator import generate_feature_icon, get_feature_image_url
from typing import Dict


class Template09Minimalist(BaseTemplate):
    """Minimalist template - ultra clean design."""
    
    template_id = "template_09"
    template_name = "Minimalist"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 55,
            "intro": 180,
            "usp_1": 75,
            "usp_2": 75,
            "usp_3": 75
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3]
        
        for i, usp in enumerate(usps):
            if usp:
                icon = generate_feature_icon(usp)
                image_url = get_feature_image_url(usp, product_name)
                usps_html += f'''
                <div class="minimal-item">
                    <div class="item-image">
                        <img src="{image_url}" alt="Feature {i+1}" />
                        <div class="item-icon">{icon}</div>
                    </div>
                    <div class="item-line"></div>
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
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; background: #ffffff; }}
        .container {{ background: #ffffff; margin: -20mm; padding: 80px 60px; }}
        .title {{ font-size: 42pt; font-weight: 100; color: #000; margin: 0 0 40px 0; line-height: 1.2; letter-spacing: 8px; text-transform: uppercase; }}
        .intro {{ font-size: 14pt; color: #666; line-height: 2; margin: 0 0 80px 0; max-width: 60%; font-weight: 300; }}
        .minimal-list {{ display: flex; flex-direction: column; gap: 60px; }}
        .minimal-item {{ display: flex; align-items: center; gap: 40px; }}
        .item-image {{ width: 120px; height: 120px; position: relative; flex-shrink: 0; border-radius: 50%; overflow: hidden; border: 1px solid #e0e0e0; }}
        .item-image img {{ width: 100%; height: 100%; object-fit: cover; opacity: 0.3; }}
        .item-icon {{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 36pt; opacity: 0.5; }}
        .item-line {{ flex: 1; height: 1px; background: #e0e0e0; }}
        .minimal-item p {{ font-size: 13pt; color: #333; margin: 0; line-height: 1.8; font-weight: 300; max-width: 400px; }}
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">{copy.title}</h1>
        <div class="intro">{copy.intro}</div>
        <div class="minimal-list">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html

