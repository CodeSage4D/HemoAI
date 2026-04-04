from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime
from .models import RoleEnum, BloodGroupEnum, RequestStatus

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: RoleEnum = RoleEnum.DONOR

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: RoleEnum
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class DonorCreate(BaseModel):
    blood_group: BloodGroupEnum
    age: int
    weight: float

class DonorResponse(BaseModel):
    id: int
    user_id: int
    blood_group: BloodGroupEnum
    age: int
    weight: float
    is_available: bool
    user: UserResponse

    class Config:
        orm_mode = True

class InventoryCreate(BaseModel):
    blood_group: BloodGroupEnum
    units: int
    expiry_date: datetime.datetime

class InventoryResponse(BaseModel):
    id: int
    blood_group: BloodGroupEnum
    units: int
    collection_date: datetime.datetime
    expiry_date: datetime.datetime
    is_expired: bool

    class Config:
        orm_mode = True

class BloodRequestCreate(BaseModel):
    patient_name: str
    blood_group: BloodGroupEnum
    units_required: int
    hemoglobin_level: float
    disease_type: str

class BloodRequestResponse(BaseModel):
    id: int
    patient_name: str
    blood_group: BloodGroupEnum
    units_required: int
    hemoglobin_level: float
    disease_type: str
    priority_score: Optional[float]
    urgency_classification: Optional[str]
    status: RequestStatus
    requested_by: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True
