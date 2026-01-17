from pydantic import BaseModel, Field, field_serializer
from typing import Optional, Dict, Any, List
from datetime import datetime, date
from decimal import Decimal
import uuid

class OpportunitySnapshotBase(BaseModel):
    opportunty_id: str = Field(..., max_length=18)
    account_id: str = Field(..., max_length=18)
    opportunity_name: str = Field(..., max_length=255)
    account_name: Optional[str] = Field(None, max_length=255)
    close_date: Optional[date] = None
    delta_average_arr: Optional[Decimal] = None
    services_attached_amount: Optional[Decimal] = None
    stage_number: Optional[str] = Field(None, max_length=100)
    forecast_category: Optional[str] = Field(None, max_length=50)
    services_next_steps: Optional[str] = Field(None, max_length=255)
    ps_manager_name: Optional[str] = Field(None, max_length=255)
    owner_name: Optional[str] = Field(None, max_length=255)
    opportunity_type: Optional[str] = Field(None, max_length=100)
    _created_date: Optional[datetime] = None
    _last_modified: Optional[datetime] = None
    _sync_timestamp: Optional[datetime] = None

class OpportunitySnapshotCreate(OpportunitySnapshotBase):
    pass

class OpportunitySnapshotResponse(OpportunitySnapshotBase):
    id: uuid.UUID

    @field_serializer('id')
    def serialize_id(self, value: uuid.UUID) -> str:
        return str(value) if value else None

    class Config:
        from_attributes = True

class OpportunityStats(BaseModel):
    total_opportunities: int
    total_opportunities_with_services: int
    total_amount: float
    total_services_amount: float
    stage_distribution: Dict[str, Dict[str, Any]]
    recent_opportunities: int
    services_logo_attach_rate: float
    services_dollar_attach_rate: float

class DealNeedingAttentionResponse(OpportunitySnapshotBase):
    id: uuid.UUID
    tags: List[str]
    
    @field_serializer('id')
    def serialize_id(self, value: uuid.UUID) -> str:
        return str(value) if value else None
    
    class Config:
        from_attributes = True
