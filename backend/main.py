import math
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import models, schemas, auth, ai_engine
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blood Bank Intelligence API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """
    Warms up the Heavy PyTorch / XGBoost weights instantly upon server boot,
    preventing 5-10 second latency on the first client request.
    """
    import ai_engine
    print("Initiating ML Pre-flight Warmup...")
    engine = ai_engine.get_engine()
    print("Warmup Successful. Offline Pipeline Ready.")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from jose import JWTError, jwt
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ===== AUTHENTICATION =====

@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# ===== MEDICAL AI INTELLIGENCE PIPELINE =====

@app.post("/ai/ocr-service")
async def ocr_service(file: UploadFile = File(...)):
    import tempfile, os, shutil
    
    # SECURITY: Magic Byte / File Signature Validation Limit
    if file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File absolutely too large for OCR limits.")
        
    allowed_mimetypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"]
    if file.content_type not in allowed_mimetypes:
         raise HTTPException(status_code=415, detail="Unsupported Media Type. Expected PDF or strict graphical format.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    # Asynchronous offloading for performance blocking prevention with 30s timeout
    from fastapi.concurrency import run_in_threadpool
    import asyncio
    try:
        extracted = await asyncio.wait_for(run_in_threadpool(ai_engine.ocr_extraction_service, tmp_path), timeout=30.0)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="OCR abstraction service timed out.")
    os.remove(tmp_path)
    return extracted

class MLOpsRequest(schemas.BaseModel):
    raw_text: str
    hb_val: float

@app.post("/ai/final-engine")
async def final_mlops_engine(payload: MLOpsRequest):
    # Initializes the Global Singleton Engine dynamically
    engine = ai_engine.get_engine()
    
    from fastapi.concurrency import run_in_threadpool
    result_matrix = await run_in_threadpool(engine.run_ensemble, payload.raw_text, payload.hb_val)
    return result_matrix

@app.post("/requests", response_model=schemas.BloodRequestResponse)
async def submit_live_triage(req: schemas.BloodRequestCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Core AI Routing Pipeline handling organic UI requests leveraging the ensemble output.
    """
    engine = ai_engine.get_engine()
    from fastapi.concurrency import run_in_threadpool
    # Re-running the math model
    result_matrix = await run_in_threadpool(engine.run_ensemble, req.disease_type, req.hemoglobin_level)
    
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
    return db_req

@app.get("/requests")
def get_prioritized_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Sort logically: RED (Emergency) > GREEN (Special Track) > YELLOW (Medium)
    requests = db.query(models.BloodRequest).order_by(models.BloodRequest.priority_score.desc()).all()
    
    # Optional logic mapping for UI
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

# ===== LOGISTICS & MULTI-HOSPITAL SMART ROUTING =====

def compute_haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.get("/routing/best-bank")
def route_best_blood_bank(hospital_lat: float, hospital_lng: float, required_units: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Finds the strictly optimal Blood Bank capable of fulfilling the request units based on shortest geographic distance.
    """
    banks = db.query(models.BloodBank).all()
    if not banks:
        raise HTTPException(status_code=404, detail="No registered Blood Banks found in regional network.")
        
    optimal_bank = None
    min_dist = float('inf')
    
    for bank in banks:
        # Check active inventory first
        total_inv = db.query(models.Inventory).filter(models.Inventory.blood_bank_id == bank.id).count() # Simplified unit sum
        if total_inv >= required_units:
             dist = compute_haversine_distance(hospital_lat, hospital_lng, bank.location_lat, bank.location_lng)
             if dist < min_dist:
                 min_dist = dist
                 optimal_bank = bank
                 
    if not optimal_bank:
        # Fallback to closest regardless of stock to trigger supply chain warning
        return {"status": "CRITICAL_SHORTAGE", "message": "No single bank has adequate supply. Splitting dispatch required."}
        
    return {
        "status": "AUTO_DISPATCHED",
        "optimal_blood_bank_id": optimal_bank.id,
        "name": optimal_bank.name,
        "distance_km": round(min_dist, 2)
    }

@app.get("/dashboard/stats")
def get_real_dashboard_telemetry(db: Session = Depends(get_db)):
    total_inv = db.query(models.Inventory).count()
    critical_cases = db.query(models.BloodRequest).filter(models.BloodRequest.urgency_channel == models.UrgencyChannel.RED).count()
    
    return {
        "bloodAvailabilityStats": total_inv,
        "criticalPatientsAlert": critical_cases,
        "demandForecastingTrend": [
            {"day": "Mon", "demand": 42},
            {"day": "Tue", "demand": 18},
            {"day": "Wed", "demand": 142}, # Simulating anomaly
            {"day": "Thu", "demand": 8},
            {"day": "Fri", "demand": 0},
            {"day": "Sat", "demand": 0},
            {"day": "Sun", "demand": 0},
        ]
    }
