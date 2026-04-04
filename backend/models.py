from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import enum
import datetime
from .database import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    STAFF = "STAFF"
    DONOR = "DONOR"

class BloodGroupEnum(str, enum.Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    O_POS = "O+"
    O_NEG = "O-"
    AB_POS = "AB+"
    AB_NEG = "AB-"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    FULFILLED = "FULFILLED"
    REJECTED = "REJECTED"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.DONOR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Donor(Base):
    __tablename__ = "donors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    blood_group = Column(Enum(BloodGroupEnum))
    age = Column(Integer)
    weight = Column(Float)
    last_donation = Column(DateTime, nullable=True)
    is_available = Column(Boolean, default=True)
    
    user = relationship("User")

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    blood_group = Column(Enum(BloodGroupEnum), index=True)
    units = Column(Integer, default=1)
    collection_date = Column(DateTime, default=datetime.datetime.utcnow)
    expiry_date = Column(DateTime)
    is_expired = Column(Boolean, default=False)

class BloodRequest(Base):
    __tablename__ = "blood_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    blood_group = Column(Enum(BloodGroupEnum))
    units_required = Column(Integer)
    hemoglobin_level = Column(Float)
    disease_type = Column(String)
    priority_score = Column(Float, nullable=True) # AI updated
    urgency_classification = Column(String, nullable=True) # AI Updated
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    requested_by = Column(Integer, ForeignKey("users.id"))
    
    requester = relationship("User")
