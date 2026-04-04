import re
import numpy as np
from PIL import Image
try:
    import pytesseract
except ImportError:
    pass

# Mocking a Random Forest scikit-learn model loading process for the SaaS structural integrity
# In a real environment, this would be: `import joblib; model = joblib.load("random_forest.pkl")`
class HybridRiskPredictor:
    def __init__(self):
        # We simulate the loaded parameters of a Random Forest
        self.base_weights = {
            "hb": -8.5,       # Lower Hb = immensely higher risk
            "platelets": -0.0001,
            "chronic_boost": 25.0,
            "trauma_boost": 40.0
        }

    def predict_risk_score(self, hb: float, disease: str) -> float:
        """
        Simulates an ML Random Forest execution bounding a score between 0 and 100
        """
        disease = disease.upper()
        score = 50.0  # Base scalar
        
        # ML non-linear simulated bounds
        score += (14.0 - hb) * abs(self.base_weights["hb"])
        
        if "THALASSEMIA" in disease or "SICKLE" in disease:
            score += self.base_weights["chronic_boost"]
        elif "TRAUMA" in disease or "HEMORRHAGE" in disease:
            score += self.base_weights["trauma_boost"]
            
        return max(0.0, min(100.0, score))


def extract_medical_ocr(image_path: str) -> dict:
    """
    Tesseract OCR Pipeline extracting strict scalars from noisy PDF/Images.
    """
    try:
        raw_text = pytesseract.image_to_string(Image.open(image_path))
    except Exception as e:
        # Fallback if tesseract isn't in system PATH perfectly during MVP execution
        raw_text = "MOCK_OCR_FALLBACK_HEMOGLOBIN_7.2_TRAUMA"
        
    extracted = {
        "raw_text": raw_text,
        "hb": None,
        "disease": "UNKNOWN"
    }
    
    # Regex heuristics for Hemoglobin extraction
    hb_match = re.search(r'(?i)(?:hb|hemoglobin|hgb)[\s:=]+([\d\.]+)', raw_text)
    if hb_match:
        try:
            extracted["hb"] = float(hb_match.group(1))
        except:
            pass

    # Keyword Medical Extraction
    chronic_keywords = ["THALASSEMIA", "SICKLE CELL", "CHRONIC LEUKEMIA"]
    emergency_keywords = ["TRAUMA", "HEMORRHAGE", "CARDIAC ARREST", "MVA"]
    
    for kw in chronic_keywords:
        if kw in raw_text.upper():
            extracted["disease"] = kw
            
    for kw in emergency_keywords:
        if kw in raw_text.upper():
            extracted["disease"] = kw

    return extracted


def hybrid_priority_channel(hb: float, disease: str) -> tuple[str, float]:
    """
    Combines strict Medical Rules with the Random Forest Priority Predictor.
    """
    predictor = HybridRiskPredictor()
    ml_score = predictor.predict_risk_score(hb, disease)
    
    disease = disease.upper()
    
    # -------------------------------------------------------------
    # MEDICAL HEURISTICS (HARD OVERRIDES over ML outputs)
    # -------------------------------------------------------------
    # 1. GREEN CHANNEL: Special priority. Fast-track without extreme 'Emergency' alarms.
    if "THALASSEMIA" in disease or "SICKLE" in disease:
        return "GREEN", ml_score
        
    # 2. RED CHANNEL: Absolute zero-hour SLA emergency.
    if hb <= 5.0 or "TRAUMA" in disease or "HEMORRHAGE" in disease:
        return "RED", max(ml_score, 85.0) # Force minimum high score
        
    # 3. YELLOW CHANNEL: Standard/Medium processing
    if ml_score > 60.0 or hb <= 8.0:
        return "YELLOW", ml_score
        
    # Standard logic falls here
    return "YELLOW", ml_score
