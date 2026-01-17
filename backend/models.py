from sqlalchemy import Column, String, Integer, Float, DateTime, Date, Text, DECIMAL, Uuid
from database import Base
import uuid

class OpportunitySnapshot(Base):
    __tablename__ = "opportunity_snapshots"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    opportunty_id = Column(String(18), nullable=False, unique=True)
    account_id = Column(String(18), nullable=False)
    opportunity_name = Column(String(255), nullable=False)
    account_name = Column(String(255))
    close_date = Column(Date)
    delta_average_arr = Column(DECIMAL(15, 2))
    services_attached_amount = Column(DECIMAL(15, 2))
    stage_number = Column(String(100))
    forecast_category = Column(String(50))
    services_next_steps = Column(String(255))
    ps_manager_name = Column(String(255))
    owner_name = Column(String(255))
    opportunity_type = Column(String(100))
    _created_date = Column(DateTime)
    _last_modified = Column(DateTime)
    _sync_timestamp = Column(DateTime)
    
    @property
    def id_str(self):
        return str(self.id) if self.id else None
