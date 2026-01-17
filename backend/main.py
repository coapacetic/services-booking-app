from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, date
import os

from database import SessionLocal, engine, Base
from models import OpportunitySnapshot
from schemas import OpportunitySnapshotCreate, OpportunitySnapshotResponse, OpportunityStats, DealNeedingAttentionResponse
from init_db import initialize

initialize()

app = FastAPI(
    title="Opportunity Management API",
    description="API for managing Salesforce opportunity snapshots",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Opportunity Management API", "version": "1.0.0"}

@app.get("/opportunities", response_model=List[OpportunitySnapshotResponse])
def get_opportunities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    stage: Optional[str] = None,
    account_name: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(OpportunitySnapshot)
    
    if stage:
        query = query.filter(OpportunitySnapshot.stage_number.ilike(f"%{stage}%"))
    if account_name:
        query = query.filter(OpportunitySnapshot.account_name.ilike(f"%{account_name}%"))
    if min_amount:
        query = query.filter(OpportunitySnapshot.delta_average_arr >= min_amount)
    if max_amount:
        query = query.filter(OpportunitySnapshot.delta_average_arr <= max_amount)
    
    opportunities = query.offset(skip).limit(limit).all()
    return opportunities

@app.get("/opportunities/{opportunity_id}", response_model=OpportunitySnapshotResponse)
def get_opportunity(opportunity_id: str, db: Session = Depends(get_db)):
    opportunity = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot.opportunty_id == opportunity_id
    ).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity

@app.post("/opportunities", response_model=OpportunitySnapshotResponse)
def create_opportunity(
    opportunity: OpportunitySnapshotCreate, 
    db: Session = Depends(get_db)
):
    db_opportunity = OpportunitySnapshot(**opportunity.dict())
    db.add(db_opportunity)
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity

@app.put("/opportunities/{opportunity_id}", response_model=OpportunitySnapshotResponse)
def update_opportunity(
    opportunity_id: str, 
    opportunity_update: OpportunitySnapshotCreate,
    db: Session = Depends(get_db)
):
    db_opportunity = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot.opportunty_id == opportunity_id
    ).first()
    if not db_opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    for field, value in opportunity_update.dict().items():
        setattr(db_opportunity, field, value)
    
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity

@app.delete("/opportunities/{opportunity_id}")
def delete_opportunity(opportunity_id: str, db: Session = Depends(get_db)):
    db_opportunity = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot.opportunty_id == opportunity_id
    ).first()
    if not db_opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    db.delete(db_opportunity)
    db.commit()
    return {"message": "Opportunity deleted successfully"}

@app.get("/stats", response_model=OpportunityStats)
def get_opportunity_stats(db: Session = Depends(get_db)):
    total_opportunities = db.query(OpportunitySnapshot).count()
    
    total_opportunities_with_services = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot.services_attached_amount > 0
    ).count()

    total_value = db.query(OpportunitySnapshot.delta_average_arr).filter(
        OpportunitySnapshot.delta_average_arr.isnot(None)
    ).all()
    total_amount = sum(value[0] for value in total_value if value[0])

    total_services_amount = db.query(OpportunitySnapshot.services_attached_amount).filter(
        OpportunitySnapshot.services_attached_amount > 0
    ).all()
    total_services_amount = sum(value[0] for value in total_services_amount if value[0])
    
    # Stage distribution
    stage_stats = db.query(
        OpportunitySnapshot.stage_number,
        func.count(OpportunitySnapshot.id).label('count'),
        func.sum(OpportunitySnapshot.delta_average_arr).label('total_amount')
    ).group_by(OpportunitySnapshot.stage_number).all()
    
    stage_distribution = {
        stage: {
            "count": count,
            "total_amount": float(total_amount) if total_amount else 0.0
        }
        for stage, count, total_amount in stage_stats
    }
    
    # Recent opportunities (last 30 days)
    from datetime import timedelta
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_opportunities = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot._sync_timestamp >= thirty_days_ago
    ).count()
    
    # Services attach metrics for Stage 3 or later
    stage_3_plus_stages = ["3", "4", "5"]
    
    # Total opportunities in stage 3+
    total_opps_stage_3_plus = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot.stage_number.in_(stage_3_plus_stages)
    ).count()
    
    # Opportunities with services in stage 3+
    opps_with_services_stage_3_plus = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot.stage_number.in_(stage_3_plus_stages),
        OpportunitySnapshot.services_attached_amount > 0
    ).count()
    
    # Services Logo Attach Rate: (opps with services in stage 3+) / (total opps in stage 3+)
    services_logo_attach_rate = 0.0
    if total_opps_stage_3_plus > 0:
        services_logo_attach_rate = (opps_with_services_stage_3_plus / total_opps_stage_3_plus) * 100
    
    # Total services amount in stage 3+
    services_amount_stage_3_plus = db.query(
        func.sum(OpportunitySnapshot.services_attached_amount)
    ).filter(
        OpportunitySnapshot.stage_number.in_(stage_3_plus_stages),
        OpportunitySnapshot.services_attached_amount.isnot(None)
    ).scalar() or 0
    
    # Total delta average ARR in stage 3+
    delta_arr_stage_3_plus = db.query(
        func.sum(OpportunitySnapshot.delta_average_arr)
    ).filter(
        OpportunitySnapshot.stage_number.in_(stage_3_plus_stages),
        OpportunitySnapshot.delta_average_arr.isnot(None)
    ).scalar() or 0
    
    # Services Dollar Attach Rate: (total services amount in stage 3+) / (total delta ARR in stage 3+)
    services_dollar_attach_rate = 0.0
    if delta_arr_stage_3_plus > 0:
        services_dollar_attach_rate = (float(services_amount_stage_3_plus) / float(delta_arr_stage_3_plus)) * 100
    
    return OpportunityStats(
        total_opportunities=total_opportunities,
        total_opportunities_with_services=total_opportunities_with_services,
        total_amount=total_amount,
        total_services_amount=total_services_amount,
        stage_distribution=stage_distribution,
        recent_opportunities=recent_opportunities,
        services_logo_attach_rate=services_logo_attach_rate,
        services_dollar_attach_rate=services_dollar_attach_rate,
    )

@app.get("/deals-needing-attention", response_model=List[DealNeedingAttentionResponse])
def get_deals_needing_attention(db: Session = Depends(get_db)):
    """
    Get deals in stage 3 or later with high ARR (>= 100,000) that need attention.
    Returns deals that either:
    1. Have no next step notes (tagged as "Needs notes")
    2. Have no services attached (tagged as "Needs services")
    """
    MIN_ARR = 100000
    MIN_STAGE = 3
    
    query = db.query(OpportunitySnapshot).filter(
        OpportunitySnapshot.delta_average_arr >= MIN_ARR
    )
    
    all_opportunities = query.all()
    
    deals_needing_attention = []
    for opp in all_opportunities:
        try:
            stage_num = int(opp.stage_number) if opp.stage_number else 0
        except (ValueError, TypeError):
            stage_num = 0
        
        if stage_num < MIN_STAGE:
            continue
        
        tags = []
        
        needs_notes = not opp.services_next_steps or opp.services_next_steps.strip() == ""
        if needs_notes:
            tags.append("Needs notes")
        
        needs_services = not opp.services_attached_amount or float(opp.services_attached_amount) <= 0
        if needs_services:
            tags.append("Needs services")
        
        if tags:
            deal_data = {
                "id": opp.id,
                "opportunty_id": opp.opportunty_id,
                "account_id": opp.account_id,
                "opportunity_name": opp.opportunity_name,
                "account_name": opp.account_name,
                "close_date": opp.close_date,
                "delta_average_arr": opp.delta_average_arr,
                "services_attached_amount": opp.services_attached_amount,
                "stage_number": opp.stage_number,
                "forecast_category": opp.forecast_category,
                "services_next_steps": opp.services_next_steps,
                "ps_manager_name": opp.ps_manager_name,
                "owner_name": opp.owner_name,
                "opportunity_type": opp.opportunity_type,
                "tags": tags,
            }
            deals_needing_attention.append(deal_data)
    
    return deals_needing_attention

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
