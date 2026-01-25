from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date, datetime


# ==================== Subsidy Schemas ====================

class SubsidyBase(BaseModel):
    name: str
    target_industry: Optional[str] = None
    target_region: Optional[str] = None
    max_amount: Optional[int] = None
    subsidy_rate: Optional[str] = None
    deadline: Optional[date] = None
    official_url: Optional[str] = None
    description: Optional[str] = None
    purposes: Optional[str] = None


class SubsidyResponse(SubsidyBase):
    id: int
    match_score: Optional[int] = None
    match_reason: Optional[List[str]] = None

    class Config:
        from_attributes = True


class SubsidyMatchRequest(BaseModel):
    industry: str
    region: str
    purpose: str
    employee_count: Optional[int] = None


class SubsidyMatchResponse(BaseModel):
    subsidies: List[SubsidyResponse]
    total_count: int


# ==================== User Schemas ====================

class UserBase(BaseModel):
    business_name: str
    industry: str
    region: str
    employee_count: Optional[int] = None
    annual_sales: Optional[int] = None
    investment_plan: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== Application Schemas ====================

class ApplicationBase(BaseModel):
    subsidy_id: int
    plan_details: str


class ApplicationCreate(ApplicationBase):
    user_id: int


class ManualApplicationCreate(BaseModel):
    user_id: int
    manual_subsidy_name: str
    status: str
    created_at: Optional[date] = None


class DraftGenerateRequest(BaseModel):
    user_id: int
    subsidy_id: int
    plan_details: str


class RefineRequest(BaseModel):
    user_id: int
    subsidy_id: int
    current_text: str
    focus_point: Optional[str] = None


class DraftGenerateResponse(BaseModel):
    draft_id: int
    draft_text: str
    subsidy_name: str
    official_url: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    subsidy_id: int
    subsidy_name: Optional[str] = None
    manual_subsidy_name: Optional[str] = None
    status: str
    ai_draft_text: Optional[str] = None
    plan_details: Optional[str] = None
    created_at: Optional[datetime] = None
    official_url: Optional[str] = None

    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    status: str
