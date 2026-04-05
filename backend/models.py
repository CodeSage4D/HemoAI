from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
import enum
import datetime
from database import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    STAFF = "STAFF"
    DONOR = "DONOR"
    HOSPITAL = "HOSPITAL"

class BloodGroupEnum(str, enum.Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    O_POS = "O+"
    O_NEG = "O-"
    AB_POS = "AB+"
    AB_NEG = "AB-"

class UrgencyChannel(str, enum.Enum):
    GREEN = "GREEN"    # Special Priority (Chronic)
    YELLOW = "YELLOW"  # Medium Priority (Routine)
    RED = "RED"        # Emergency Priority (Severe)

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    DISPATCHED = "DISPATCHED"
    FULFILLED = "FULFILLED"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.DONOR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # Link to admin login
    name = Column(String)
    license_no = Column(String, unique=True)
    location_lat = Column(Float)
    location_lng = Column(Float)
    
    patients = relationship("Patient", back_populates="hospital")

class BloodBank(Base):
    __tablename__ = "blood_banks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location_lat = Column(Float)
    location_lng = Column(Float)
    
    inventory = relationship("Inventory", back_populates="blood_bank")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    name = Column(String)
    blood_group = Column(Enum(BloodGroupEnum))
    chronic_conditions = Column(String, nullable=True) # E.g. Thalassemia
    
    hospital = relationship("Hospital", back_populates="patients")
    reports = relationship("MedicalReport", back_populates="patient")

class MedicalReport(Base):
    __tablename__ = "medical_reports"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    record_date = Column(DateTime, default=datetime.datetime.utcnow)
    ocr_raw_text = Column(Text, nullable=True)
    extracted_hb = Column(Float, nullable=True)
    extracted_platelets = Column(Integer, nullable=True)
    identified_disease = Column(String, nullable=True)
    
    patient = relationship("Patient", back_populates="reports")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    blood_bank_id = Column(Integer, ForeignKey("blood_banks.id"), index=True)
    blood_group = Column(Enum(BloodGroupEnum), index=True)
    units = Column(Integer, default=1)
    expiry_date = Column(DateTime, index=True)
    
    blood_bank = relationship("BloodBank", back_populates="inventory")

class BloodRequest(Base):
    __tablename__ = "blood_requests"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    units_required = Column(Integer)
    urgency_channel = Column(Enum(UrgencyChannel), index=True) # Core output of AI pipeline
    priority_score = Column(Float, index=True) # Core output of AI pipeline (0-100)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
