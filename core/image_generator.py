"""Image generation for templates using AI."""
import os
import requests
from typing import Optional, List
from config.settings import settings
import base64
from io import BytesIO
from PIL import Image
import hashlib


def generate_image_from_text(prompt: str, style: str = "professional") -> Optional[bytes]:
    """
    Generate image from text prompt.
    
    For now, uses placeholder service. In production, integrate with:
    - DALL-E 3 (OpenAI)
    - Stable Diffusion API
    - Midjourney API
    - Or use placeholder images with feature-based selection
    """
    # For MVP: Use placeholder images based on keywords
    # In production, replace with actual AI image generation API
    
    # Hash the prompt to get consistent placeholder
    prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
    
    # Use placeholder service (replace with real API)
    placeholder_url = f"https://via.placeholder.com/800x600/667eea/ffffff?text={prompt[:50]}"
    
    try:
        response = requests.get(placeholder_url, timeout=10)
        if response.status_code == 200:
            return response.content
    except Exception as e:
        print(f"Error generating placeholder image: {e}")
    
    return None


def generate_feature_icon(feature_text: str) -> Optional[str]:
    """
    Generate or select an icon/emoji for a feature.
    Returns emoji or SVG icon based on keywords.
    """
    feature_lower = feature_text.lower()
    
    # Icon mapping based on keywords
    icon_map = {
        "ai": "🤖",
        "artificial": "🤖",
        "automation": "⚙️",
        "secure": "🔒",
        "security": "🔒",
        "fast": "⚡",
        "speed": "⚡",
        "cloud": "☁️",
        "analytics": "📊",
        "data": "📊",
        "mobile": "📱",
        "api": "🔌",
        "integration": "🔗",
        "scalable": "📈",
        "scale": "📈",
        "real-time": "🔄",
        "realtime": "🔄",
        "monitoring": "👁️",
        "dashboard": "📊",
        "report": "📄",
        "collaboration": "👥",
        "team": "👥",
        "workflow": "🔄",
        "productivity": "⚡",
        "efficient": "⚡",
        "smart": "🧠",
        "intelligent": "🧠",
    }
    
    for keyword, icon in icon_map.items():
        if keyword in feature_lower:
            return icon
    
    # Default icons
    default_icons = ["✨", "🚀", "💡", "⭐", "🎯", "🔥", "💎", "🌟"]
    return default_icons[hash(feature_text) % len(default_icons)]


def get_feature_image_url(feature: str, product_name: str) -> str:
    """
    Generate a data URL or URL for feature image.
    For now, returns placeholder with feature text.
    """
    # Encode feature text for placeholder
    encoded_text = feature.replace(" ", "+")[:30]
    return f"https://via.placeholder.com/400x300/667eea/ffffff?text={encoded_text}"


def create_svg_icon(icon_type: str, color: str = "#667eea") -> str:
    """Create SVG icon based on type."""
    icons = {
        "check": f'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        "star": f'<svg width="24" height="24" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
        "arrow": f'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    }
    return icons.get(icon_type, icons["check"])

