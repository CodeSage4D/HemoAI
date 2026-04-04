from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from . import models, schemas, auth, ml_model
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blood Bank Intelligence API", version="1.0.0")

# Setup CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# ===== INVENTORY =====
@app.get("/inventory", response_model=List[schemas.InventoryResponse])
def get_inventory(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    inventory = db.query(models.Inventory).all()
    return inventory

# ===== BLOOD REQUESTS & AI INTELLIGENCE =====
@app.post("/requests", response_model=schemas.BloodRequestResponse)
def create_blood_request(req: schemas.BloodRequestCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    
    # Run the AI Patient Intelligence Model
    priority_score, urgency_class = ml_model.predict_patient_priority(
        hemoglobin_level=req.hemoglobin_level, 
        disease_type=req.disease_type
    )

    db_req = models.BloodRequest(
        **req.dict(),
        priority_score=priority_score,
        urgency_classification=urgency_class,
        requested_by=current_user.id
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

@app.get("/requests", response_model=List[schemas.BloodRequestResponse])
def get_blood_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    requests = db.query(models.BloodRequest).order_by(models.BloodRequest.priority_score.desc()).all()
    return requests

@app.get("/dashboard/stats")
def get_dashboard_summary(db: Session = Depends(get_db)):
    # Very basic demo dashboard summary endpoint
    total_units = db.query(models.Inventory).count()
    critical_requests = db.query(models.BloodRequest).filter(models.BloodRequest.urgency_classification == "CRITICAL").count()
    return {
        "bloodAvailabilityStats": total_units,
        "criticalPatientsAlert": critical_requests,
        "demandForecastingTrend": [
            {"day": "Mon", "demand": 12},
            {"day": "Tue", "demand": 19},
            {"day": "Wed", "demand": 15},
            {"day": "Thu", "demand": 22},
            {"day": "Fri", "demand": 30},
            {"day": "Sat", "demand": 28},
            {"day": "Sun", "demand": 18},
        ]
    }
