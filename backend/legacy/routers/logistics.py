from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import models, schemas, ai_engine
import math
from database import get_db
from dependencies import get_current_user, limiter
from logger import logger

router = APIRouter(prefix="/logistics", tags=["Logistics & Routing"])

@router.post("/requests", response_model=schemas.BloodRequestResponse)
@limiter.limit("30/minute")
async def submit_live_triage(request: Request, req: schemas.BloodRequestCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    logger.info(f"Live Triage submitted by {current_user.email} for PT:{req.patient_id}")
    engine = ai_engine.get_engine()
    from fastapi.concurrency import run_in_threadpool
    
    # We pass a minimal payload simulating the ML limits for pure routing purposes
    # The previous code passed disease_type and hemoglobin as multiple args to run_ensemble which expects a dict. Let's map it safely.
    mock_payload = {
        "raw_text": req.disease_type, 
        "hb": req.hemoglobin_level
    }
    logger.debug("Triage ML calculation...")
    result_matrix = await run_in_threadpool(engine.run_ensemble, mock_payload)
    
    db_req = models.BloodRequest(
        patient_id=req.patient_id,
        units_required=req.units_required,
        urgency_channel=result_matrix["channel"],
        priority_score=result_matrix["risk_score"],
        status="PENDING"
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    logger.success(f"Triage Created (ID: {db_req.id}) mapping to Channel {db_req.urgency_channel}")
    return db_req

@router.get("/requests")
def get_prioritized_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    requests = db.query(models.BloodRequest).order_by(models.BloodRequest.priority_score.desc()).all()
    
    result = []
    for r in requests:
        result.append({
            "id": r.id,
            "patient_id": r.patient_id,
            "units_required": r.units_required,
            "urgency_channel": r.urgency_channel.value if hasattr(r.urgency_channel, 'value') else r.urgency_channel,
            "priority_score": r.priority_score,
            "status": r.status.value if hasattr(r.status, 'value') else r.status
        })
    return result

def compute_haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.get("/routing/best-bank")
@limiter.limit("20/minute")
def route_best_blood_bank(request: Request, hospital_lat: float, hospital_lng: float, required_units: int, blood_group: str = "O+", db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    logger.info(f"Routing logic initiated for ({hospital_lat}, {hospital_lng}) requesting {required_units}x {blood_group}")
    banks = db.query(models.BloodBank).all()
    if not banks:
        logger.error("No registered Blood Banks found in regional network.")
        raise HTTPException(status_code=404, detail="No registered Blood Banks found in regional network.")
        
    optimal_bank = None
    min_score = float('inf') # We calculate a composite score: (distance_km * 0.4) + (days_to_expiry * 0.6)
                             # Lower score is generally better (closest distance + expires quickly to enforce FIFO)
    optimal_dist = 0
    from datetime import datetime

    for bank in banks:
        # Check active inventory matching blood group
        inventory_items = db.query(models.Inventory).filter(
            models.Inventory.blood_bank_id == bank.id,
            models.Inventory.blood_group == blood_group
        ).all()
        
        total_inv = sum(item.units for item in inventory_items)
        if total_inv >= required_units:
             dist = compute_haversine_distance(hospital_lat, hospital_lng, bank.location_lat, bank.location_lng)
             
             # Implement FIFO Intelligence
             # Determine shortest expiry in matching inventory
             shortest_expiry_days = 999
             for item in inventory_items:
                 if item.expiry_date:
                     days_left = (item.expiry_date - datetime.utcnow()).days
                     if days_left < shortest_expiry_days and days_left >= 0:
                         shortest_expiry_days = max(days_left, 1) # Prevent 0
             
             # Score formula (Custom AI Routing algorithm weighting FIFO urgency and Distance)
             if shortest_expiry_days == 999: shortest_expiry_days = 30 # fallback
             
             composite_score = (dist * 0.4) + (shortest_expiry_days * 0.6)
             
             logger.debug(f"Bank {bank.name} -> Dist: {dist:.2f}km | Expiry: {shortest_expiry_days}days | Score: {composite_score:.2f}")

             if composite_score < min_score:
                 min_score = composite_score
                 optimal_bank = bank
                 optimal_dist = dist
                 
    if not optimal_bank:
        logger.warning(f"CRITICAL SHORTAGE: Failed to find {required_units}x {blood_group}")
        return {"status": "CRITICAL_SHORTAGE", "message": "No single bank has adequate supply. Splitting dispatch required."}
        
    logger.success(f"Allocating to {optimal_bank.name} via Intelligent Routing.")
    return {
        "status": "AUTO_DISPATCHED",
        "optimal_blood_bank_id": optimal_bank.id,
        "name": optimal_bank.name,
        "distance_km": round(optimal_dist, 2),
        "intelligence_score": round(min_score, 2)
    }
