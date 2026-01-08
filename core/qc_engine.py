"""Quality control engine for onepager validation."""
from pydantic import BaseModel
from typing import List, Dict
from templates.base import BaseTemplate
from core.copy_generator import CopySlots
from config.settings import settings


class QCCheck(BaseModel):
    """Individual QC check result."""
    check_name: str
    status: str  # "pass", "fail", "warning"
    message: str
    severity: str = "medium"  # "low", "medium", "high"


class QCResult(BaseModel):
    """Overall QC result."""
    overall_status: str  # "pass", "fail", "warning"
    checks: List[QCCheck]
    fixes_applied: List[str] = []


def check_quality(template: BaseTemplate, copy: CopySlots) -> QCResult:
    """
    Perform quality control checks on template and copy.
    
    Args:
        template: Template instance
        copy: CopySlots with generated copy
        
    Returns:
        QCResult with check outcomes
    """
    checks = []
    slot_limits = template.get_slot_limits()
    
    # Check 1: Text overflow (character limits)
    for slot_name, max_chars in slot_limits.items():
        copy_value = getattr(copy, slot_name, None)
        if copy_value:
            actual_length = len(copy_value)
            if actual_length > max_chars:
                checks.append(QCCheck(
                    check_name=f"text_overflow_{slot_name}",
                    status="fail",
                    message=f"{slot_name} exceeds limit: {actual_length}/{max_chars} chars",
                    severity="high"
                ))
            elif actual_length > max_chars * 0.9:  # Warning at 90% of limit
                checks.append(QCCheck(
                    check_name=f"text_near_limit_{slot_name}",
                    status="warning",
                    message=f"{slot_name} near limit: {actual_length}/{max_chars} chars",
                    severity="medium"
                ))
    
    # Check 2: Required slots filled
    required_slots = ["title", "intro"]
    for slot in required_slots:
        if slot in slot_limits:
            copy_value = getattr(copy, slot, None)
            if not copy_value or not copy_value.strip():
                checks.append(QCCheck(
                    check_name=f"missing_required_{slot}",
                    status="fail",
                    message=f"Required slot '{slot}' is empty",
                    severity="high"
                ))
    
    # Check 3: Minimum content length
    if copy.intro and len(copy.intro.strip()) < 50:
        checks.append(QCCheck(
            check_name="intro_too_short",
            status="warning",
            message=f"Introduction is very short: {len(copy.intro)} chars",
            severity="low"
        ))
    
    # Determine overall status
    has_failures = any(c.status == "fail" for c in checks)
    has_warnings = any(c.status == "warning" for c in checks)
    
    if has_failures:
        overall_status = "fail"
    elif has_warnings:
        overall_status = "warning"
    else:
        overall_status = "pass"
    
    return QCResult(
        overall_status=overall_status,
        checks=checks,
        fixes_applied=[]
    )

