"""Web scraping using Gemini API to extract product information from URLs."""
import google.generativeai as genai
import requests
from typing import Optional, Dict
from bs4 import BeautifulSoup
from pydantic import BaseModel
from config.settings import settings
import re


class ScrapedProductData(BaseModel):
    """Extracted product data from website."""
    productName: str
    description: str
    features: list[str]
    audience: str  # "B2B" or "B2C"
    language: str = "en"
    imageUrl: Optional[str] = None


def _get_gemini_client():
    """Initialize Gemini API client."""
    if not settings.google_api_key:
        raise ValueError("GOOGLE_API_KEY not set in environment")
    genai.configure(api_key=settings.google_api_key)
    model_name = settings.gemini_model
    if not model_name.startswith("models/"):
        model_name = f"models/{model_name}"
    return genai.GenerativeModel(model_name)


def _fetch_webpage_content(url: str) -> tuple[str, Optional[str]]:
    """
    Fetch webpage content and extract text.
    Returns (text_content, image_url)
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        # Extract text
        text = soup.get_text(separator=' ', strip=True)
        # Clean up whitespace
        text = ' '.join(text.split())
        
        # Try to find main product image
        image_url = None
        img_tags = soup.find_all('img', src=True)
        for img in img_tags:
            src = img.get('src', '')
            if src and not src.startswith('data:'):
                if any(keyword in src.lower() for keyword in ['product', 'hero', 'main', 'feature']):
                    if src.startswith('//'):
                        image_url = 'https:' + src
                    elif src.startswith('/'):
                        from urllib.parse import urljoin
                        image_url = urljoin(url, src)
                    else:
                        image_url = src
                    break
        
        return text[:5000], image_url  # Limit to 5000 chars for Gemini
    
    except Exception as e:
        raise Exception(f"Failed to fetch webpage: {str(e)}")


def scrape_product_data(url: str) -> ScrapedProductData:
    """
    Scrape product data from URL using Gemini API.
    
    Uses Gemini to analyze webpage content and extract structured product information.
    """
    try:
        # Fetch webpage content
        webpage_text, image_url = _fetch_webpage_content(url)
        
        # Use Gemini to extract product information
        model = _get_gemini_client()
        
        # Smart URL detection for better data
        url_lower = url.lower()
        context_hint = ""
        if 'colgate' in url_lower or 'toothpaste' in url_lower:
            context_hint = "This is likely a Colgate dental product. Extract specific dental benefits, whitening features, and oral care technology."
        elif 'iphone' in url_lower or 'apple.com' in url_lower:
            context_hint = "This is likely an Apple iPhone. Extract chip details (A-series), camera specs, battery life, and display features."
        elif 'tesla' in url_lower:
            context_hint = "This is likely a Tesla vehicle. Extract range, performance specs, autopilot features, and charging capabilities."
        elif 'nike' in url_lower:
            context_hint = "This is likely a Nike product. Extract running technology, cushioning, design features, and athletic performance benefits."
        elif 'samsung' in url_lower or 'galaxy' in url_lower:
            context_hint = "This is likely a Samsung Galaxy device. Extract camera specifications, display technology, processor, and S Pen features."
        elif 'macbook' in url_lower or 'mac' in url_lower:
            context_hint = "This is likely a MacBook. Extract M-series chip details, display specs, battery life, and professional features."

        prompt = f"""Analyze the following webpage content and extract product/service information in JSON format.

Webpage URL: {url}
{context_hint}
Webpage Content (first 5000 chars):
{webpage_text}

Extract the following information:
1. Product/Service Name (exact name from the page, no extra text)
2. Description (120-150 words, NO REPETITION - each sentence must be unique and informative)
3. Key Features (exactly 4 features, each 10-20 words, be specific and DIFFERENT from each other)
4. Target Audience (determine if this is B2B or B2C based on the content)

CRITICAL REQUIREMENTS:
- Description must NOT repeat information - each sentence should add new value
- Features must be DISTINCT - no overlapping information
- Remove any marketing fluff or repetitive phrases
- Description should flow naturally without redundancy

Return ONLY valid JSON in this exact format:
{{
    "productName": "exact product name",
    "description": "120-150 word description with NO repetition",
    "features": ["distinct feature 1", "distinct feature 2", "distinct feature 3", "distinct feature 4"],
    "audience": "B2B" or "B2C"
}}

Important:
- Use actual information from the webpage, not generic placeholders
- Description: 120-150 words, NO repeated information
- Features: Exactly 4, each unique and specific
- Determine audience from context (B2B = business software/services, B2C = consumer products)
- Return ONLY the JSON, no other text
"""

        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Try to extract JSON if wrapped in markdown code blocks
        json_match = re.search(r'\{[^{}]*\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            json_str = response_text
        
        # Parse JSON
        import json
        data = json.loads(json_str)
        
        # Validate and create ScrapedProductData
        scraped_data = ScrapedProductData(
            productName=data.get('productName', 'Unknown Product'),
            description=data.get('description', ''),
            features=data.get('features', [])[:4],  # Ensure max 4 features
            audience=data.get('audience', 'B2B'),
            language='en',
            imageUrl=image_url
        )
        
        # Ensure we have exactly 4 features
        while len(scraped_data.features) < 4:
            scraped_data.features.append('')
        
        return scraped_data
        
    except Exception as e:
        raise Exception(f"Failed to scrape product data: {str(e)}")

