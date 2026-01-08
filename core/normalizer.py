"""Input normalization - converts CSV/Excel/JSON to ProductBrief."""
import pandas as pd
import json
from pathlib import Path
from typing import Union, List
from models.product_brief import ProductBrief, ProductType, TargetAudience


def normalize_csv(csv_path: Union[str, Path]) -> List[ProductBrief]:
    """
    Normalize CSV input to ProductBrief objects.
    
    Expected CSV columns:
    - product_id, type, name, description, category, features, target_audience, language
    
    Args:
        csv_path: Path to CSV file
        
    Returns:
        List of ProductBrief objects
    """
    df = pd.read_csv(csv_path)
    
    # Normalize column names (case-insensitive, handle spaces)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    
    briefs = []
    for _, row in df.iterrows():
        # Parse features (can be comma-separated string or list)
        features = []
        if "features" in row and pd.notna(row["features"]):
            if isinstance(row["features"], str):
                features = [f.strip() for f in row["features"].split(",") if f.strip()]
            elif isinstance(row["features"], list):
                features = row["features"]
        
        # Parse metadata (optional columns)
        metadata = {}
        optional_cols = ["price", "cta", "images", "url"]
        for col in optional_cols:
            if col in row and pd.notna(row[col]):
                if col == "images" and isinstance(row[col], str):
                    metadata[col] = [img.strip() for img in row[col].split(",") if img.strip()]
                else:
                    metadata[col] = row[col]
        
        brief = ProductBrief(
            product_id=str(row.get("product_id", f"PROD-{len(briefs)+1}")),
            type=ProductType(row.get("type", "product").lower()),
            name=str(row.get("name", "")),
            description=str(row.get("description", "")),
            category=str(row.get("category", "")) if pd.notna(row.get("category")) else None,
            features=features,
            target_audience=TargetAudience(row.get("target_audience", "B2B").upper()),
            language=str(row.get("language", "en")),
            metadata=metadata
        )
        briefs.append(brief)
    
    return briefs


def normalize_json(json_path: Union[str, Path]) -> List[ProductBrief]:
    """
    Normalize JSON input to ProductBrief objects.
    
    Args:
        json_path: Path to JSON file (can be single object or array)
        
    Returns:
        List of ProductBrief objects
    """
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Handle both single object and array
    if isinstance(data, dict):
        data = [data]
    
    briefs = []
    for item in data:
        brief = ProductBrief(**item)
        briefs.append(brief)
    
    return briefs


def save_brief_json(brief: ProductBrief, output_path: Union[str, Path]) -> None:
    """Save ProductBrief to JSON file."""
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(brief.model_dump(), f, indent=2, ensure_ascii=False)

