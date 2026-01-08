"""Slot-based copy generation using LLM (Gemini/OpenAI/Claude)."""
import google.generativeai as genai
from typing import Dict, Optional
from pydantic import BaseModel
from models.product_brief import ProductBrief
from config.settings import settings
from concurrent.futures import ThreadPoolExecutor, as_completed
import time


class CopySlots(BaseModel):
    """Generated copy slots for a template."""
    title: str
    intro: str
    usp_1: Optional[str] = None
    usp_2: Optional[str] = None
    usp_3: Optional[str] = None
    usp_4: Optional[str] = None
    usp_5: Optional[str] = None


def _get_gemini_client():
    """Initialize Gemini API client."""
    if not settings.google_api_key:
        raise ValueError("GOOGLE_API_KEY not set in environment")
    genai.configure(api_key=settings.google_api_key)
    # Ensure model name includes 'models/' prefix if not already present
    model_name = settings.gemini_model
    if not model_name.startswith("models/"):
        model_name = f"models/{model_name}"
    return genai.GenerativeModel(model_name)


def _create_prompt(brief: ProductBrief, slot_type: str, max_chars: int) -> str:
    """Create prompt for a specific copy slot."""
    
    slot_prompts = {
        "title": f"""Generate a compelling, professional title/headline for a {brief.type.value} onepager.

Product/Service: {brief.name}
Description: {brief.description}
Category: {brief.category or 'N/A'}
Target Audience: {brief.target_audience.value}

Requirements:
- Maximum {max_chars} characters
- Professional, clear, and engaging
- Suitable for {brief.target_audience.value} audience
- No marketing fluff or exaggerated claims

Generate ONLY the title text, nothing else.""",

        "intro": f"""Generate a concise introduction paragraph for a {brief.type.value} onepager.

Product/Service: {brief.name}
Description: {brief.description}
Category: {brief.category or 'N/A'}
Target Audience: {brief.target_audience.value}

Requirements:
- Maximum {max_chars} characters
- Professional tone
- Clear value proposition
- Suitable for {brief.target_audience.value} audience

Generate ONLY the introduction text, nothing else.""",

        "usp": f"""Generate a compelling unique selling point (USP) for a {brief.type.value} onepager.

Product/Service: {brief.name}
Description: {brief.description}
Features: {', '.join(brief.features) if brief.features else 'N/A'}
Target Audience: {brief.target_audience.value}

Requirements:
- Maximum {max_chars} characters
- Focus on ONE key benefit or feature
- Clear and specific
- Professional tone

Generate ONLY the USP text, nothing else."""
    }
    
    return slot_prompts.get(slot_type, slot_prompts["intro"])


def generate_copy(brief: ProductBrief, template_slots: Dict[str, int]) -> CopySlots:
    """
    Generate copy for all template slots using LLM.
    
    Args:
        brief: ProductBrief object
        template_slots: Dict mapping slot names to max character limits
            e.g., {"title": 60, "intro": 200, "usp_1": 80, ...}
    
    Returns:
        CopySlots object with generated copy
    """
    if settings.llm_provider == "gemini":
        return _generate_with_gemini(brief, template_slots)
    else:
        raise NotImplementedError(f"LLM provider '{settings.llm_provider}' not implemented yet")


def _generate_with_gemini(brief: ProductBrief, template_slots: Dict[str, int]) -> CopySlots:
    """Generate copy using Gemini API - optimized with parallel calls."""
    model = _get_gemini_client()
    
    generated = {}
    
    def _get_text_from_response(response):
        """Extract text from Gemini API response."""
        try:
            if hasattr(response, 'text'):
                return response.text.strip()
            elif hasattr(response, 'candidates') and response.candidates:
                return response.candidates[0].content.parts[0].text.strip()
            else:
                return str(response).strip()
        except Exception as e:
            raise ValueError(f"Failed to extract text from Gemini response: {e}")
    
    def _generate_slot(slot_name: str, slot_type: str, max_chars: int):
        """Generate a single slot - used for parallel execution."""
        try:
            if slot_type == "cta":
                prompt = f"""Generate a call-to-action button text for a {brief.type.value} onepager.

Product/Service: {brief.name}
Target Audience: {brief.target_audience.value}

Requirements:
- Maximum {max_chars} characters
- Action-oriented (e.g., "Start Free Trial", "Request Demo", "Learn More")
- Professional tone

Generate ONLY the CTA text, nothing else."""
            else:
                prompt = _create_prompt(brief, slot_type, max_chars)
            
            response = model.generate_content(prompt)
            text = _get_text_from_response(response)
            return slot_name, text[:max_chars]
        except Exception as e:
            # Return empty string on error, will be caught by QC
            return slot_name, ""
    
    # Prepare all slot generation tasks
    tasks = []
    
    if "title" in template_slots:
        tasks.append(("title", "title", template_slots["title"]))
    
    if "intro" in template_slots:
        tasks.append(("intro", "intro", template_slots["intro"]))
    
    # Generate USPs
    usp_count = sum(1 for k in template_slots.keys() if k.startswith("usp_"))
    for i in range(1, usp_count + 1):
        slot_key = f"usp_{i}"
        if slot_key in template_slots:
            tasks.append((slot_key, "usp", template_slots[slot_key]))
    
    # CTA removed - no longer generating or displaying CTA buttons
    # (User requested removal - no "Request Demo" or similar buttons)
    
    # Execute all API calls in parallel
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=6) as executor:
        # Submit all tasks
        future_to_slot = {
            executor.submit(_generate_slot, slot_name, slot_type, max_chars): slot_name
            for slot_name, slot_type, max_chars in tasks
        }
        
        # Collect results as they complete
        for future in as_completed(future_to_slot):
            slot_name, text = future.result()
            generated[slot_name] = text
    
    elapsed_time = time.time() - start_time
    print(f"Generated {len(tasks)} slots in {elapsed_time:.2f} seconds (parallel)")
    
    return CopySlots(**generated)

