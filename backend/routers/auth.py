from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from dependencies import get_current_user, limiter
from logger import logger
from fastapi import Request

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/users", response_model=schemas.UserResponse)
@limiter.limit("20/minute")
def create_user(request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Attempting to register user: {user.email}")
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        logger.warning(f"Registration failed: Email {user.email} already registered")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.success(f"User {user.email} successfully registered")
    return db_user

@router.post("/token", response_model=schemas.Token)
@limiter.limit("20/minute")
def login_for_access_token(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logger.info(f"Login attempt for user: {form_data.username}")
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Login failed for user {form_data.username}: Incorrect credentials")
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role.value})
    logger.success(f"User {form_data.username} logged in successfully")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
