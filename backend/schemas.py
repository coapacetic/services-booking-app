from pydantic import BaseModel, Field, field_serializer
from typing import Optional, Dict, Any
from datetime import datetime, date
from decimal import Decimal
import uuid

class OpportunitySnapshotBase(BaseModel):
    salesforce_id: str = Field(..., max_length=18)
    name: str = Field(..., max_length=255)
    account_name: Optional[str] = Field(None, max_length=255)
    amount: Optional[Decimal] = None
    stage: Optional[str] = Field(None, max_length=100)
    probability: Optional[int] = Field(None, ge=0, le=100)
    close_date: Optional[date] = None
    created_date: Optional[datetime] = None
    last_modified: Optional[datetime] = None
    owner_name: Optional[str] = Field(None, max_length=255)
    type: Optional[str] = Field(None, max_length=100)
    lead_source: Optional[str] = Field(None, max_length=100)
    campaign: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    forecast_category: Optional[str] = Field(None, max_length=50)
    sync_timestamp: Optional[datetime] = None
    in_manager_forecast: Optional[bool] = False
    stage_number: Optional[int] = None
    stage_name: Optional[str] = Field(None, max_length=100)
    delta_average_arr: Optional[Decimal] = None
    services_attached_amount: Optional[Decimal] = None
    services_next_steps: Optional[str] = None

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
    total_amount: float
    stage_distribution: Dict[str, Dict[str, Any]]
    recent_opportunities: int
