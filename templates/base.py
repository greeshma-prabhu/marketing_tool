"""Base template class for all onepager templates."""
from abc import ABC, abstractmethod
from typing import Dict
from core.copy_generator import CopySlots


class BaseTemplate(ABC):
    """Base class for all onepager templates."""
    
    template_id: str
    template_name: str
    format: str = "A4"  # A4 or A5
    
    @abstractmethod
    def get_slot_limits(self) -> Dict[str, int]:
        """
        Return dictionary mapping slot names to max character limits.
        
        Example:
            {
                "title": 60,
                "intro": 200,
                "usp_1": 80,
                "usp_2": 80,
                "usp_3": 80
            }
        """
        pass
    
    @abstractmethod
    def render_html(self, copy: CopySlots, product_name: str) -> str:
        """
        Render HTML for the template with provided copy.
        
        Args:
            copy: CopySlots object with generated copy
            product_name: Product/service name
            
        Returns:
            HTML string
        """
        pass
    
    def get_css(self) -> str:
        """
        Return CSS styles for the template.
        Override in subclasses for custom styles.
        """
        return """
        @page {
            size: A4;
            margin: 20mm;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
        }
        """

