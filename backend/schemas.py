from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, BloodGroupEnum, UrgencyChannel, RequestStatus

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[RoleEnum] = RoleEnum.DONOR

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: RoleEnum
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class MedicalReportCreate(BaseModel):
    patient_id: int
    extracted_hb: Optional[float]
    extracted_platelets: Optional[int]
    identified_disease: Optional[str]

class BloodRequestResponse(BaseModel):
    id: int
    patient_id: int
    units_required: int
    urgency_channel: UrgencyChannel
    priority_score: float
    status: RequestStatus
    
    class Config:
        orm_mode = True

class BloodRequestCreate(BaseModel):
    patient_id: int
    units_required: int
    hemoglobin_level: float
    disease_type: str
