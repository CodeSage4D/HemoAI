import random

# In a real deployed SAAS, this would load a pretrained Scikit-Learn or TensorFlow model
# e.g. import joblib
# model = joblib.load('patient_priority_model.pkl')

disease_risks = {
    "cancer": 0.9,
    "leukemia": 1.0,
    "anemia": 0.7,
    "surgery": 0.8,
    "accident": 1.0,
    "routine": 0.2
}

def predict_patient_priority(hemoglobin_level: float, disease_type: str):
    """
    Simulates an AI model predicting a patient's priority score (0.0 to 1.0)
    and an urgency classification based on hemoglobin level and disease.
    """
    disease_base_risk = disease_risks.get(disease_type.lower(), 0.5)
    
    # Lower hemoglobin = higher risk
    hb_factor = 0.0
    if hemoglobin_level < 5.0:
        hb_factor = 1.0
    elif hemoglobin_level < 7.0:
        hb_factor = 0.8
    elif hemoglobin_level < 10.0:
        hb_factor = 0.5
    else:
        hb_factor = 0.1
        
    score = (disease_base_risk * 0.6) + (hb_factor * 0.4)
    # Add minor variance to simulate AI confidence distribution
    score_variance = score + random.uniform(-0.05, 0.05)
    final_score = min(max(score_variance, 0.0), 1.0)

    classification = "CRITICAL"
    if final_score < 0.4:
        classification = "LOW_PRIORITY"
    elif final_score < 0.7:
        classification = "URGENT"

    return final_score, classification
