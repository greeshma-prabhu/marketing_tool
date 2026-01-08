"""Template 07: Elegant - Luxury design with images."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from core.image_generator import generate_feature_icon, get_feature_image_url
from typing import Dict


class Template07Elegant(BaseTemplate):
    """Elegant template - luxury design with feature images."""
    
    template_id = "template_07"
    template_name = "Elegant"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 65,
            "intro": 220,
            "usp_1": 85,
            "usp_2": 85,
            "usp_3": 85,
            "usp_4": 85
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3, copy.usp_4]
        colors = ["#d4af37", "#c9a961", "#b8860b", "#daa520"]
        
        for i, usp in enumerate(usps):
            if usp:
                color = colors[i % len(colors)]
                icon = generate_feature_icon(usp)
                image_url = get_feature_image_url(usp, product_name)
                usps_html += f'''
                <div class="elegant-feature">
                    <div class="feature-image" style="background: linear-gradient(135deg, {color}15 0%, {color}05 100%);">
                        <div class="feature-icon">{icon}</div>
                        <img src="{image_url}" alt="{usp[:30]}" class="feature-img" />
                    </div>
                    <div class="feature-content">
                        <h3 style="color: {color};">Feature {i+1}</h3>
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
        body {{ font-family: 'Cormorant Garamond', 'Times New Roman', serif; margin: 0; background: #faf8f3; }}
        .container {{ background: #ffffff; margin: -20mm; padding: 60px 50px; min-height: 100vh; }}
        .header {{ text-align: center; margin-bottom: 50px; border-bottom: 2px solid #d4af37; padding-bottom: 30px; }}
        .title {{ font-size: 52pt; font-weight: 300; color: #2c2416; margin: 0; line-height: 1.1; letter-spacing: 3px; text-transform: uppercase; }}
        .intro {{ font-size: 17pt; color: #5a4a3a; line-height: 2; margin: 30px auto 0; max-width: 80%; text-align: center; font-style: italic; }}
        .features-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin: 50px 0; }}
        .elegant-feature {{ text-align: center; }}
        .feature-image {{ position: relative; height: 200px; border-radius: 12px; margin-bottom: 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; }}
        .feature-icon {{ font-size: 48pt; position: absolute; z-index: 2; opacity: 0.3; }}
        .feature-img {{ width: 100%; height: 100%; object-fit: cover; opacity: 0.4; }}
        .feature-content h3 {{ font-size: 18pt; font-weight: 600; margin: 0 0 15px 0; letter-spacing: 1px; }}
        .feature-content p {{ font-size: 14pt; color: #4a3a2a; margin: 0; line-height: 1.8; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">{copy.title}</h1>
            <div class="intro">{copy.intro}</div>
        </div>
        <div class="features-grid">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html

