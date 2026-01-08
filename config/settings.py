"""Configuration settings for the Onepager Generation Agent."""
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # LLM Configuration
    google_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    
    # PosterMyWall API Configuration
    postermywall_api_key: Optional[str] = None
    
    # LLM Model Selection
    gemini_model: str = "gemini-2.5-pro"  # Options: gemini-2.5-pro, gemini-2.5-flash
    openai_model: str = "gpt-4-turbo-preview"
    anthropic_model: str = "claude-3-opus-20240229"
    
    # Default LLM Provider (gemini, openai, anthropic)
    llm_provider: str = "gemini"
    
    # Generation Settings
    default_language: str = "en"
    default_template: str = "template_01"
    max_variants: int = 3
    variant_generation_enabled: bool = True
    
    # Quality Control
    min_font_size: int = 10
    qc_auto_fix_enabled: bool = True
    qc_max_iterations: int = 3
    qc_strict_mode: bool = False
    
    # Output Settings
    default_format: str = "A4"
    a5_enabled: bool = True
    png_preview_enabled: bool = True
    output_dir: str = "./data/outputs"
    
    # Template Settings
    template_dir: str = "./templates"
    gold_standards_dir: str = "./data/gold_standards"
    
    # Brand Profiles
    brand_profiles_dir: str = "./config/brand_profiles"
    default_brand_profile: str = "default"
    
    # Forbidden Claims
    forbidden_claims_file: str = "./config/forbidden_claims.json"
    
    # Performance
    cache_enabled: bool = True
    cache_ttl: int = 3600
    batch_size: int = 10
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "./logs/marketing_tool.log"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields in .env file


# Global settings instance
settings = Settings()

