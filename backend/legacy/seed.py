from database import SessionLocal, engine
import models
import auth

print("Creating database bounds...")
# Drop and recreate ensuring absolute clean seeding
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    print("Initiating Default Seeds...")

    # Users
    admin = models.User(email="admin@hemoi.com", full_name="Super Admin", role=models.RoleEnum.ADMIN, hashed_password=auth.get_password_hash("SecurePassword123!"))
    hospital_user = models.User(email="dispatch@svtc.org", full_name="Valley Trauma", role=models.RoleEnum.HOSPITAL, hashed_password=auth.get_password_hash("HospitalAccess123!"))
    patient_user = models.User(email="john.doe@mail.com", full_name="John Doe", role=models.RoleEnum.DONOR, hashed_password=auth.get_password_hash("PatientPassword123!"))
    
    db.add_all([admin, hospital_user, patient_user])
    db.commit()
    
    # Hospital Tracking
    hospital = models.Hospital(user_id=hospital_user.id, name="Silicon Valley Trauma Center", license_no="SVTC-999-XYZ", location_lat=37.3382, location_lng=-121.8863)
    db.add(hospital)
    db.commit()
    
    # Patient Node
    patient = models.Patient(hospital_id=hospital.id, name="John Doe", blood_group=models.BloodGroupEnum.O_NEG, chronic_conditions="None")
    db.add(patient)
    db.commit()

    # Regional Blood Bank
    regional_bank = models.BloodBank(name="Regional Distro Hub", location_lat=37.3600, location_lng=-121.9400)
    db.add(regional_bank)
    db.commit()

    # Inventory
    for b_type in [models.BloodGroupEnum.O_NEG, models.BloodGroupEnum.O_POS, models.BloodGroupEnum.A_POS]:
         inv = models.Inventory(blood_bank_id=regional_bank.id, blood_group=b_type, units=50)
         db.add(inv)
         
    db.commit()
    print("SUCCESS: Database fully seeded with Production Default Variables.")
    db.close()

if __name__ == "__main__":
    seed_data()
