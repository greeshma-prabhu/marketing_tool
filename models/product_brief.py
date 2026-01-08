"""ProductBrief data model for normalized product/service information."""
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class ProductType(str, Enum):
    """Product or service type."""
    PRODUCT = "product"
    SERVICE = "service"


class TargetAudience(str, Enum):
    """Target audience type."""
    B2B = "B2B"
    B2C = "B2C"
    BOTH = "BOTH"


class ProductBrief(BaseModel):
    """Normalized product/service brief model."""
    
    product_id: str = Field(..., description="Unique product identifier")
    type: ProductType = Field(..., description="Product or service")
    name: str = Field(..., description="Product/service name")
    description: str = Field(..., description="Full description")
    category: Optional[str] = Field(None, description="Product category")
    features: List[str] = Field(default_factory=list, description="Key features")
    target_audience: TargetAudience = Field(default=TargetAudience.B2B, description="Target audience")
    language: str = Field(default="en", description="Language code (en, zh-CN, etc.)")
    
    # Optional metadata
    metadata: dict = Field(default_factory=dict, description="Additional metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "product_id": "PROD-001",
                "type": "product",
                "name": "Smart Widget",
                "description": "Advanced widget with AI capabilities",
                "category": "Technology",
                "features": ["AI-powered", "Cloud sync", "Real-time analytics"],
                "target_audience": "B2B",
                "language": "en",
                "metadata": {
                    "price": "€99/month",
                    "cta": "Start Free Trial",
                    "images": []
                }
            }
        }

