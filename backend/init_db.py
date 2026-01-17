import csv
import os
from datetime import datetime
from decimal import Decimal
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import OpportunitySnapshot


def init_database():
    """Initialize the database tables."""
    Base.metadata.create_all(bind=engine)


def load_sample_data(db: Session, csv_path: str = None):
    """Load sample data from CSV if the table is empty."""
    existing_count = db.query(OpportunitySnapshot).count()
    if existing_count > 0:
        print(f"Database already has {existing_count} records. Skipping sample data load.")
        return
    
    if csv_path is None:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "database", "sample_data.csv")
    
    if not os.path.exists(csv_path):
        print(f"Sample data file not found at {csv_path}. Skipping sample data load.")
        return
    
    print(f"Loading sample data from {csv_path}...")
    
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            opportunity = OpportunitySnapshot(
                opportunty_id=row['opportunty_id'],
                account_id=row['account_id'],
                opportunity_name=row['opportunity_name'],
                account_name=row['account_name'] or None,
                close_date=datetime.strptime(row['close_date'], '%Y-%m-%d').date() if row['close_date'] else None,
                delta_average_arr=Decimal(row['delta_average_arr']) if row['delta_average_arr'] else None,
                services_attached_amount=Decimal(row['services_attached_amount']) if row['services_attached_amount'] else None,
                stage_number=row['stage_number'] or None,
                forecast_category=row['forecast_category'] or None,
                services_next_steps=row['services_next_steps'] or None,
                ps_manager_name=row['ps_manager_name'] or None,
                owner_name=row['owner_name'] or None,
                opportunity_type=row['opportunity_type'] or None,
                _created_date=datetime.now(),
                _last_modified=datetime.now(),
                _sync_timestamp=datetime.now(),
            )
            db.add(opportunity)
    
    db.commit()
    print(f"Loaded sample data successfully.")


def initialize():
    """Initialize database and load sample data."""
    init_database()
    db = SessionLocal()
    try:
        load_sample_data(db)
    finally:
        db.close()


if __name__ == "__main__":
    initialize()
