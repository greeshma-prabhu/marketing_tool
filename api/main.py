"""FastAPI main application."""
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict
import sys
from pathlib import Path
import tempfile
import os
import requests

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.normalizer import normalize_csv
from core.copy_generator import generate_copy
from core.renderer import render_pdf
from core.qc_engine import check_quality
from templates.template_01_minimal import Template01Minimal
from templates.template_02_modern import Template02Modern
from templates.template_03_dense import Template03Dense
from templates.template_04_corporate import Template04Corporate
from templates.template_05_creative import Template05Creative
from templates.template_06_tech import Template06Tech
from templates.template_07_elegant import Template07Elegant
from templates.template_08_bold import Template08Bold
from templates.template_09_minimalist import Template09Minimalist
from templates.template_10_showcase import Template10Showcase
from models.product_brief import ProductBrief, ProductType, TargetAudience
from config.settings import settings

app = FastAPI(
    title="Onepager Generation Agent API",
    description="AI-powered onepager/brochure generation API",
    version="1.0.0"
)

# CORS middleware for React frontend
# Get allowed origins from environment variable or use defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Supports both local dev and production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for API
class ProductInput(BaseModel):
    product_id: str
    type: str  # "product" or "service"
    name: str
    description: str
    category: Optional[str] = None
    features: Optional[List[str]] = []
    target_audience: str  # "B2B", "B2C", "BOTH"
    language: str = "en"
    template_id: Optional[str] = "template_01"  # template_01, template_02, template_03


class GenerationResponse(BaseModel):
    success: bool
    message: str
    product_id: str
    filename: str
    file_size: int
    qc_status: str
    qc_checks: List[dict] = []


class HealthResponse(BaseModel):
    status: str
    api_version: str
    gemini_configured: bool


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "message": "Onepager Generation Agent API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "api_version": "1.0.0",
        "gemini_configured": bool(settings.google_api_key)
    }


@app.post("/api/generate/from-csv", tags=["Generation"])
async def generate_from_csv(file: UploadFile = File(...)):
    """
    Generate onepagers from uploaded CSV file.
    
    Returns a ZIP file with all generated PDFs.
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        # Normalize CSV
        briefs = normalize_csv(tmp_path)
        
        if not briefs:
            raise HTTPException(status_code=400, detail="No valid products found in CSV")
        
        # Generate PDFs (default to template_01, can be enhanced to read from CSV)
        template = Template01Minimal()  # TODO: Add template selection from CSV
        pdf_files = []
        
        for brief in briefs:
            try:
                # Generate copy
                slot_limits = template.get_slot_limits()
                copy = generate_copy(brief, slot_limits)
                
                # Generate PDF
                pdf_bytes = render_pdf(template, copy, brief.name)
                
                # Save to temp file
                pdf_filename = f"{brief.product_id}_{template.template_id}_{brief.language}.pdf"
                pdf_path = os.path.join(tempfile.gettempdir(), pdf_filename)
                with open(pdf_path, "wb") as f:
                    f.write(pdf_bytes)
                
                pdf_files.append((pdf_path, pdf_filename))
                
            except Exception as e:
                # Continue with other products if one fails
                continue
        
        # Cleanup CSV temp file
        os.unlink(tmp_path)
        
        if not pdf_files:
            raise HTTPException(status_code=500, detail="Failed to generate any PDFs")
        
        # For now, return first PDF (we'll add ZIP support later)
        # TODO: Create ZIP file with all PDFs
        pdf_path, pdf_filename = pdf_files[0]
        
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=pdf_filename,
            headers={"Content-Disposition": f"attachment; filename={pdf_filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate/from-json", response_model=GenerationResponse, tags=["Generation"])
async def generate_from_json(product: ProductInput):
    """
    Generate onepager from JSON input.
    
    Returns PDF file and QC results.
    """
    try:
        # Validate API key
        if not settings.google_api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        # Create ProductBrief
        brief = ProductBrief(
            product_id=product.product_id,
            type=ProductType(product.type),
            name=product.name,
            description=product.description,
            category=product.category,
            features=product.features or [],
            target_audience=TargetAudience(product.target_audience),
            language=product.language
        )
        
        # Select template (default to template_01)
        # Select template
        template = get_template(product.template_id)
        
        # Generate copy
        slot_limits = template.get_slot_limits()
        copy = generate_copy(brief, slot_limits)
        
        # Quality control
        qc_result = check_quality(template, copy)
        
        # Generate PDF
        pdf_bytes = render_pdf(template, copy, brief.name)
        
        # Save to temp file
        filename = f"{brief.product_id}_{template.template_id}_{brief.language}.pdf"
        pdf_path = os.path.join(tempfile.gettempdir(), filename)
        with open(pdf_path, "wb") as f:
            f.write(pdf_bytes)
        
        return GenerationResponse(
            success=True,
            message="Onepager generated successfully",
            product_id=brief.product_id,
            filename=filename,
            file_size=len(pdf_bytes),
            qc_status=qc_result.overall_status,
            qc_checks=[
                {
                    "check_name": check.check_name,
                    "status": check.status,
                    "message": check.message,
                    "severity": check.severity
                }
                for check in qc_result.checks
            ]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download/{filename}", tags=["Download"])
async def download_pdf(filename: str):
    """Download generated PDF by filename."""
    pdf_path = os.path.join(tempfile.gettempdir(), filename)
    
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=filename,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@app.get("/api/templates", tags=["Templates"])
async def get_templates():
    """Get available templates."""
    return {
        "templates": [
            {
                "id": "template_01",
                "name": "Executive Brief",
                "description": "Clean and elegant with professional framing",
                "format": "A4",
                "preview_color": "#667eea"
            },
            {
                "id": "template_02",
                "name": "Product Focus",
                "description": "Magazine-style layout with visual impact",
                "format": "A4",
                "preview_color": "#3b82f6"
            },
            {
                "id": "template_03",
                "name": "Data-Driven",
                "description": "Infographic style for detailed information",
                "format": "A4",
                "preview_color": "#0f172a"
            },
            {
                "id": "template_04",
                "name": "Corporate Classic",
                "description": "Formal business style with large typography",
                "format": "A4",
                "preview_color": "#1a1a1a"
            },
            {
                "id": "template_05",
                "name": "Creative Showcase",
                "description": "Bold poster design with dynamic elements",
                "format": "A4",
                "preview_color": "#667eea"
            },
            {
                "id": "template_06",
                "name": "Tech Innovation",
                "description": "Modern dashboard style for tech products",
                "format": "A4",
                "preview_color": "#00d4ff"
            },
            {
                "id": "template_07",
                "name": "Luxury Premium",
                "description": "Elegant design with feature imagery",
                "format": "A4",
                "preview_color": "#d4af37"
            },
            {
                "id": "template_08",
                "name": "Bold Statement",
                "description": "High contrast design for maximum impact",
                "format": "A4",
                "preview_color": "#ff0000"
            },
            {
                "id": "template_09",
                "name": "Minimalist Pro",
                "description": "Ultra clean design with subtle visuals",
                "format": "A4",
                "preview_color": "#000000"
            },
            {
                "id": "template_10",
                "name": "Visual Story",
                "description": "Image-focused layout for storytelling",
                "format": "A4",
                "preview_color": "#667eea"
            }
        ]
    }


def get_template(template_id: str):
    """Get template instance by ID."""
    templates = {
        "template_01": Template01Minimal,
        "template_02": Template02Modern,
        "template_03": Template03Dense,
        "template_04": Template04Corporate,
        "template_05": Template05Creative,
        "template_06": Template06Tech,
        "template_07": Template07Elegant,
        "template_08": Template08Bold,
        "template_09": Template09Minimalist,
        "template_10": Template10Showcase,
    }
    template_class = templates.get(template_id, Template01Minimal)
    return template_class()


# Web Scraping endpoint
from core.web_scraper import scrape_product_data
from core.variant_generator import generate_variant_headlines, reorder_features_for_variant
from pydantic import HttpUrl


class ScrapeRequest(BaseModel):
    url: str


class ScrapeResponse(BaseModel):
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None


class VariantGenerationRequest(BaseModel):
    productName: str
    description: str
    features: List[str]
    audience: str
    language: str = 'en'


class VariantGenerationResponse(BaseModel):
    success: bool
    variants: Optional[List[Dict]] = None
    error: Optional[str] = None


@app.post("/api/scrape", response_model=ScrapeResponse, tags=["Scraping"])
async def scrape_website(request: ScrapeRequest):
    """
    Scrape product data from a website URL using Gemini API.
    
    Fetches webpage content and uses Gemini to extract structured product information.
    """
    try:
        if not settings.google_api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        scraped_data = scrape_product_data(request.url)
        
        return ScrapeResponse(
            success=True,
            data={
                "productName": scraped_data.productName,
                "description": scraped_data.description,
                "features": scraped_data.features,
                "audience": scraped_data.audience,
                "language": scraped_data.language,
                "imageUrl": scraped_data.imageUrl
            }
        )
    except Exception as e:
        return ScrapeResponse(
            success=False,
            error=str(e)
        )


@app.post("/api/generate-variants", response_model=VariantGenerationResponse, tags=["Generation"])
async def generate_variants(request: VariantGenerationRequest):
    """
    Generate 3 truly different variants with unique headlines, taglines, and feature ordering.
    """
    try:
        if not settings.google_api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        # Generate different headlines/taglines using AI
        variant_data = generate_variant_headlines(
            request.productName,
            request.description,
            request.audience,
            request.language
        )
        
        # Create variants with reordered features
        variants = []
        accent_colors = ['#4F46E5', '#10B981', '#8B5CF6']  # Blue, Green, Purple
        
        for i, var_data in enumerate(variant_data):
            tone = var_data.get('tone', 'professional')
            reordered_features = reorder_features_for_variant(request.features, tone)
            
            variants.append({
                "id": f"variant-{['A', 'B', 'C'][i]}",
                "headline": var_data.get('headline', ''),
                "tagline": var_data.get('tagline', ''),
                "accentColor": accent_colors[i],
                "tone": tone,
                "features": reordered_features,
                "layoutEmphasis": {
                    'professional': 'features',
                    'emotional': 'benefits',
                    'technical': 'specs'
                }.get(tone, 'features')
            })
        
        return VariantGenerationResponse(
            success=True,
            variants=variants
        )
    except Exception as e:
        return VariantGenerationResponse(
            success=False,
            error=str(e)
        )


# Include preview router
from api.preview import router as preview_router
app.include_router(preview_router)

# Include auth router
from api.auth import router as auth_router
app.include_router(auth_router)


# PosterMyWall API Proxy endpoints (to bypass CORS)
class PosterMyWallTemplatesRequest(BaseModel):
    category: str = "flyer"
    limit: int = 20


class PosterMyWallTemplatesResponse(BaseModel):
    success: bool
    templates: Optional[List[Dict]] = None
    error: Optional[str] = None


@app.post("/api/postermywall/templates", response_model=PosterMyWallTemplatesResponse, tags=["PosterMyWall"])
async def get_postermywall_templates(request: PosterMyWallTemplatesRequest):
    """
    Proxy endpoint to fetch templates from PosterMyWall API.
    This bypasses CORS restrictions by calling the API from the backend.
    """
    try:
        # Get API key from environment or settings
        api_key = (
            os.getenv("POSTERMYWALL_API_KEY") 
            or os.getenv("NEXT_PUBLIC_POSTERMYWALL_API_KEY")
            or (getattr(settings, 'postermywall_api_key', None) if hasattr(settings, 'postermywall_api_key') else None)
        )
        
        # Debug: Print API key status (first 10 chars only)
        print(f"[DEBUG] API Key found: {bool(api_key)}, first 10: {api_key[:10] if api_key else 'None'}...")
        
        if not api_key or api_key == "your_postermywall_api_key":
            print("[DEBUG] API key not configured properly")
            return PosterMyWallTemplatesResponse(
                success=True,
                templates=[],
                error=None
            )
        
        # Try PosterMyWall API - multiple possible endpoints
        api_key_value = api_key.strip()
        endpoints_to_try = [
            ("https://api.postermywall.com/v1/templates", "v1"),
            ("https://api.postermywall.com/api/v1/templates", "v1-alt"),
            ("https://www.postermywall.com/api/v1/templates", "www-v1"),
            ("https://api.postermywall.com/templates", "no-v1"),
            ("https://api.postermywall.com/v1/designs", "designs-v1"),
            ("https://api.postermywall.com/v1/gallery", "gallery-v1"),
            ("https://api.postermywall.com/v1/catalog", "catalog-v1"),
        ]
        
        # Prioritize Bearer token (most common for PosterMyWall)
        auth_methods = [
            {"headers": {"Authorization": f"Bearer {api_key_value}", "Accept": "application/json", "Content-Type": "application/json"}},
            {"headers": {"Authorization": f"Token {api_key_value}", "Accept": "application/json"}},
            {"headers": {"X-API-Key": api_key_value, "Accept": "application/json"}},
            {"headers": {"api-key": api_key_value, "Accept": "application/json"}},
            {"params": {"api_key": api_key_value}, "headers": {"Accept": "application/json"}},
            {"params": {"key": api_key_value}, "headers": {"Accept": "application/json"}},
        ]
        
        # Try only the most likely endpoint with Bearer token (fastest - 2 second timeout)
        endpoint_url = "https://api.postermywall.com/v1/templates"
        print(f"[DEBUG] Trying PosterMyWall API: {endpoint_url}")
        
        try:
            headers = {"Authorization": f"Bearer {api_key_value}", "Accept": "application/json"}
            params = {"category": request.category, "limit": request.limit}
            
            response = requests.get(endpoint_url, headers=headers, params=params, timeout=2.0)
            print(f"[DEBUG] Response: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    templates_data = []
                    if isinstance(data, dict):
                        templates_data = data.get("templates") or data.get("data") or data.get("results") or data.get("items") or []
                    elif isinstance(data, list):
                        templates_data = data
                    
                    if templates_data:
                        formatted_templates = []
                        for template in templates_data[:request.limit]:
                            if isinstance(template, dict):
                                template_id = template.get("id") or template.get("template_id") or f"pmw-{len(formatted_templates)}"
                                formatted_templates.append({
                                    "id": str(template_id),
                                    "name": template.get("name") or template.get("title") or "Untitled Template",
                                    "description": template.get("description") or template.get("desc") or "Professional template",
                                    "thumbnail_url": template.get("thumbnail_url") or template.get("thumbnail") or template.get("preview_url") or "",
                                    "preview_url": template.get("preview_url") or template.get("thumbnail_url"),
                                    "category": template.get("category") or request.category,
                                    "width": template.get("width") or 210,
                                    "height": template.get("height") or 297,
                                })
                        
                        if formatted_templates:
                            print(f"[DEBUG] ✅ Found {len(formatted_templates)} templates!")
                            return PosterMyWallTemplatesResponse(success=True, templates=formatted_templates)
                except Exception as e:
                    print(f"[DEBUG] JSON parse error: {e}")
            elif response.status_code == 401:
                print(f"[DEBUG] 401 Unauthorized - API key may be invalid")
            elif response.status_code == 404:
                print(f"[DEBUG] 404 Not Found - endpoint doesn't exist")
            else:
                print(f"[DEBUG] Status {response.status_code}")
        except requests.exceptions.Timeout:
            print(f"[DEBUG] Timeout - API not responding (likely doesn't exist)")
        except requests.exceptions.ConnectionError:
            print(f"[DEBUG] Connection error - endpoint may not exist")
        except Exception as e:
            print(f"[DEBUG] Error: {str(e)[:100]}")
        
        # If we get here, all attempts failed - but return success so frontend doesn't break
        # Frontend will use fallback templates
        print("[DEBUG] All API attempts failed - PosterMyWall API not accessible")
        print("[DEBUG] This could mean:")
        print("[DEBUG] 1. API endpoint doesn't exist or changed")
        print("[DEBUG] 2. API key is invalid")
        print("[DEBUG] 3. PosterMyWall doesn't have public template listing API")
        print("[DEBUG] Returning empty templates - frontend will use fallback templates")
        return PosterMyWallTemplatesResponse(
            success=True,
            templates=[],
            error=None
        )
        
    except Exception as e:
        # Return empty but successful - frontend will use fallback templates
        return PosterMyWallTemplatesResponse(
            success=True,
            templates=[],
            error=None
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

