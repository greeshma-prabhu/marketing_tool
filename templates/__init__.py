"""Template system for onepager generation."""
from .base import BaseTemplate
from .template_01_minimal import Template01Minimal
from .template_02_modern import Template02Modern
from .template_03_dense import Template03Dense
from .template_04_corporate import Template04Corporate
from .template_05_creative import Template05Creative
from .template_06_tech import Template06Tech
from .template_07_elegant import Template07Elegant
from .template_08_bold import Template08Bold
from .template_09_minimalist import Template09Minimalist
from .template_10_showcase import Template10Showcase

__all__ = [
    "BaseTemplate",
    "Template01Minimal",
    "Template02Modern",
    "Template03Dense",
    "Template04Corporate",
    "Template05Creative",
    "Template06Tech",
    "Template07Elegant",
    "Template08Bold",
    "Template09Minimalist",
    "Template10Showcase"
]

