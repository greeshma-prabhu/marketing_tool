"""Generate truly different variants using AI."""
import google.generativeai as genai
from typing import List, Dict
from models.product_brief import ProductBrief
from config.settings import settings
import json
import re


def _get_gemini_client():
    """Initialize Gemini API client."""
    if not settings.google_api_key:
        raise ValueError("GOOGLE_API_KEY not set in environment")
    genai.configure(api_key=settings.google_api_key)
    model_name = settings.gemini_model
    if not model_name.startswith("models/"):
        model_name = f"models/{model_name}"
    return genai.GenerativeModel(model_name)


def generate_variant_headlines(product_name: str, description: str, audience: str, language: str = 'en') -> List[Dict[str, str]]:
    """
    Generate 3 truly different headlines and taglines for variants.
    
    Returns:
        [
            {
                "headline": "...",
                "tagline": "...",
                "tone": "professional|emotional|technical"
            },
            ...
        ]
    """
    model = _get_gemini_client()
    
    # Language-specific instructions
    lang_instruction = ""
    if language == 'zh':
        lang_instruction = "\nIMPORTANT: Generate all content in Simplified Chinese (简体中文)."
    elif language == 'nl':
        lang_instruction = "\nIMPORTANT: Generate all content in Dutch (Nederlands)."
    else:
        lang_instruction = "\nIMPORTANT: Generate all content in English."
    
    prompt = f"""Generate 3 COMPLETELY DIFFERENT headlines and taglines for a product onepager.{lang_instruction}

Product Name: {product_name}
Description: {description[:300]}
Target Audience: {audience}
Language: {language}

Requirements:
1. Variant A - Professional/Business Tone:
   - Headline: Focus on excellence, quality, reliability, professional benefits
   - Tagline: Corporate, trustworthy, results-oriented
   - Example style: "Introducing [Product]: Enterprise-Grade Solutions" / "Trusted by industry leaders"

2. Variant B - Emotional/Transformational Tone:
   - Headline: Focus on transformation, experience, lifestyle, personal benefits
   - Tagline: Inspiring, aspirational, life-changing
   - Example style: "Transform Your [Domain] with [Product]" / "Experience the future today"

3. Variant C - Technical/Innovation Tone:
   - Headline: Focus on technology, innovation, specifications, advanced features
   - Tagline: Cutting-edge, technical, forward-thinking
   - Example style: "[Product]: Next-Generation Technology" / "Powered by advanced innovation"

CRITICAL: Each variant must be COMPLETELY DIFFERENT in:
- Wording (no repeated phrases)
- Tone (professional vs emotional vs technical)
- Focus (business benefits vs personal transformation vs technical specs)
- Length (vary headline lengths)

Return ONLY valid JSON:
{{
    "variants": [
        {{
            "headline": "Variant A headline (max 60 chars)",
            "tagline": "Variant A tagline (max 40 chars)",
            "tone": "professional"
        }},
        {{
            "headline": "Variant B headline (max 60 chars)",
            "tagline": "Variant B tagline (max 40 chars)",
            "tone": "emotional"
        }},
        {{
            "headline": "Variant C headline (max 60 chars)",
            "tagline": "Variant C tagline (max 40 chars)",
            "tone": "technical"
        }}
    ]
}}

Return ONLY the JSON, no other text.
"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Extract JSON
        json_match = re.search(r'\{[^{}]*"variants"[^{}]*\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            json_str = response_text
        
        data = json.loads(json_str)
        return data.get('variants', [])
    except Exception as e:
        # Fallback to default variants
        return [
            {
                "headline": f"{product_name}: Professional Excellence",
                "tagline": "Delivering superior quality and reliability",
                "tone": "professional"
            },
            {
                "headline": f"Transform Your World with {product_name}",
                "tagline": "Experience the difference that matters",
                "tone": "emotional"
            },
            {
                "headline": f"{product_name}: Advanced Innovation Technology",
                "tagline": "Cutting-edge solutions for modern challenges",
                "tone": "technical"
            }
        ]


def reorder_features_for_variant(features: List[str], variant_type: str) -> List[str]:
    """
    Reorder features based on variant type to emphasize different aspects.
    
    variant_type: 'professional', 'emotional', 'technical'
    """
    if not features or len(features) < 2:
        return features
    
    # For professional: keep original order (business-first)
    if variant_type == 'professional':
        return features
    
    # For emotional: prioritize benefits and user experience
    if variant_type == 'emotional':
        # Move features with emotional words to front
        emotional_keywords = ['experience', 'feel', 'enjoy', 'love', 'comfort', 'style', 'beautiful']
        emotional_features = [f for f in features if any(kw in f.lower() for kw in emotional_keywords)]
        other_features = [f for f in features if f not in emotional_features]
        return emotional_features + other_features
    
    # For technical: prioritize specs and technical details
    if variant_type == 'technical':
        technical_keywords = ['spec', 'performance', 'technology', 'advanced', 'power', 'speed', 'capacity']
        technical_features = [f for f in features if any(kw in f.lower() for kw in technical_keywords)]
        other_features = [f for f in features if f not in technical_features]
        return technical_features + other_features
    
    return features

