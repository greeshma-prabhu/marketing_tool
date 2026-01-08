"""Template 06: Tech - Modern dashboard card layout."""
from .base import BaseTemplate
from core.copy_generator import CopySlots
from typing import Dict


class Template06Tech(BaseTemplate):
    """Tech template - dashboard card style."""
    
    template_id = "template_06"
    template_name = "Tech"
    format = "A4"
    
    def get_slot_limits(self) -> Dict[str, int]:
        return {
            "title": 80,
            "intro": 300,
            "usp_1": 110,
            "usp_2": 110,
            "usp_3": 110,
            "usp_4": 110,
            "usp_5": 110
        }
    
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        usps_html = ""
        usps = [copy.usp_1, copy.usp_2, copy.usp_3, copy.usp_4, copy.usp_5]
        icons = ["⚡", "🔒", "🚀", "📊", "✨"]
        for i, usp in enumerate(usps):
            if usp:
                usps_html += f'''
                <div class="dashboard-card">
                    <div class="card-top">
                        <span class="icon">{icons[i % len(icons)]}</span>
                        <span class="badge">#{i+1}</span>
                    </div>
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
        body {{ font-family: 'Inter', 'Roboto', sans-serif; margin: 0; }}
        .container {{ background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); margin: -20mm; min-height: 100vh; padding: 60px 50px; }}
        .header {{ margin-bottom: 50px; }}
        .title {{ font-size: 46pt; font-weight: 800; color: #00d4ff; margin: 0 0 25px 0; line-height: 1.1; text-shadow: 0 0 30px rgba(0,212,255,0.5); }}
        .intro {{ font-size: 16pt; color: #cbd5e1; line-height: 1.9; margin: 0; max-width: 85%; }}
        .dashboard {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin: 50px 0; }}
        .dashboard-card {{ background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); border: 1px solid rgba(0,212,255,0.3); border-radius: 16px; padding: 30px; transition: all 0.3s; }}
        .dashboard-card:hover {{ background: rgba(255,255,255,0.12); border-color: rgba(0,212,255,0.6); transform: translateY(-5px); }}
        .card-top {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }}
        .icon {{ font-size: 32pt; }}
        .badge {{ background: #00d4ff; color: #0f172a; padding: 6px 14px; border-radius: 20px; font-size: 11pt; font-weight: 800; }}
        .dashboard-card p {{ font-size: 14pt; color: #e2e8f0; margin: 0; line-height: 1.8; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">{copy.title}</h1>
            <div class="intro">{copy.intro}</div>
        </div>
        <div class="dashboard">{usps_html}</div>
    </div>
</body>
</html>
"""
        return html
