from sqlalchemy import Column, String, Integer, Float, DateTime, Date, Text, DECIMAL, Boolean
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid

class OpportunitySnapshot(Base):
    __tablename__ = "opportunity_snapshots"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    salesforce_id = Column(String(18), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    account_name = Column(String(255))
    amount = Column(DECIMAL(15, 2))
    stage = Column(String(100))
    probability = Column(Integer)
    close_date = Column(Date)
    created_date = Column(DateTime)
    last_modified = Column(DateTime)
    owner_name = Column(String(255))
    type = Column(String(100))
    lead_source = Column(String(100))
    campaign = Column(String(255))
    description = Column(Text)
    forecast_category = Column(String(50))
    sync_timestamp = Column(DateTime)
    in_manager_forecast = Column(Boolean, default=False)
    stage_number = Column(Integer)
    stage_name = Column(String(100))
    delta_average_arr = Column(DECIMAL(15, 2))
    services_attached_amount = Column(DECIMAL(15, 2))
    services_next_steps = Column(Text)
    
    @property
    def id_str(self):
        return str(self.id) if self.id else None
