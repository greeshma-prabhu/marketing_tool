"""Template 10: Showcase - Image-focused layout."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from core.image_generator import generate_feature_icon, get_feature_image_url
from typing import Dict


class Template10Showcase(BaseTemplate):
    """Showcase template - image-focused design."""
    
    template_id = "template_10"
    template_name = "Showcase"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 75,
            "intro": 260,
            "usp_1": 100,
            "usp_2": 100,
            "usp_3": 100,
            "usp_4": 100
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3, copy.usp_4]
        
        for i, usp in enumerate(usps):
            if usp:
                icon = generate_feature_icon(usp)
                image_url = get_feature_image_url(usp, product_name)
                usps_html += f'''
                <div class="showcase-card">
                    <div class="card-image-wrapper">
                        <img src="{image_url}" alt="{usp[:30]}" class="card-image" />
                        <div class="image-overlay">
                            <div class="overlay-icon">{icon}</div>
                        </div>
                    </div>
                    <div class="card-info">
                        <h3>Feature {i+1}</h3>
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
        body {{ font-family: 'Roboto', 'Arial', sans-serif; margin: 0; background: #f0f0f0; }}
        .container {{ background: #ffffff; margin: -20mm; padding: 0; min-height: 100vh; }}
        .hero {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 70px 60px; color: white; }}
        .title {{ font-size: 48pt; font-weight: 700; color: white; margin: 0 0 25px 0; line-height: 1.1; }}
        .intro {{ font-size: 17pt; color: rgba(255,255,255,0.95); line-height: 1.9; margin: 0; }}
        .showcase-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }}
        .showcase-card {{ position: relative; overflow: hidden; }}
        .card-image-wrapper {{ position: relative; height: 250px; overflow: hidden; }}
        .card-image {{ width: 100%; height: 100%; object-fit: cover; }}
        .image-overlay {{ position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(102, 126, 234, 0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }}
        .showcase-card:hover .image-overlay {{ opacity: 1; }}
        .overlay-icon {{ font-size: 64pt; color: white; }}
        .card-info {{ padding: 30px; background: white; }}
        .card-info h3 {{ font-size: 18pt; font-weight: 700; color: #667eea; margin: 0 0 15px 0; }}
        .card-info p {{ font-size: 14pt; color: #4a5568; margin: 0; line-height: 1.7; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1 class="title">{copy.title}</h1>
            <div class="intro">{copy.intro}</div>
        </div>
        <div class="showcase-grid">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html

