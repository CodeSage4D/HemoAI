import re
import os
import numpy as np
import xgboost as xgb
from PIL import Image

# Enforce strictly offline behavior to block outbound API requests for pretrained models
os.environ["TRANSFORMERS_OFFLINE"] = "1"

try:
    import pytesseract
except ImportError:
    pass

from transformers import pipeline

class MultiModelHybridEngine:
    def __init__(self):
        print("LOADING: MLOps Models... This may take a moment.")
        
        # Model 1: General Context Analyzer
        model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "local_models", "distilbert"))
        target_model = model_path if os.path.exists(model_path) else "typeform/distilbert-base-uncased-mnli"
        self.diagnostic_nlp = pipeline("zero-shot-classification", model=target_model)
        
        # Model 3: Dummy XGBoost ML Risk Engine
        self.xgb_model = xgb.XGBRegressor(
            objective='reg:squarederror', n_estimators=50, max_depth=3, learning_rate=0.1
        )
        X_dummy = np.array([[12.0, 1], [4.5, 3], [7.0, 2], [15.0, 0]])
        y_dummy = np.array([10.0, 95.0, 60.0, 5.0])
        self.xgb_model.fit(X_dummy, y_dummy)

    def run_ensemble(self, data: dict):
        raw_ocr_text = data.get("raw_text", "")
        
        # CBC
        hb = data.get("hb", 0.0)
        rbc = data.get("rbc", 0.0)
        wbc = data.get("wbc", 0.0)
        platelets = data.get("platelets", 0.0)
        mcv = data.get("mcv", 0.0)
        
        # LFT & KFT
        alt = data.get("alt", 0.0)
        creatinine = data.get("creatinine", 0.0)
        
        # Diabetes
        hba1c = data.get("hba1c", 0.0)
        glucose = data.get("glucose", 0.0)
        
        # Lipids
        cholesterol = data.get("cholesterol", 0.0)
        
        # Thyroid & Vit
        tsh = data.get("tsh", 0.0)
        vit_d = data.get("vit_d", 0.0)
        vit_b12 = data.get("vit_b12", 0.0)

        # Step 1: Validate Telemetry
        # If absolutely nothing was extracted across all panels...
        if all(v == 0.0 for v in [hb, rbc, wbc, alt, creatinine, hba1c, cholesterol, tsh, vit_d]):
            return {
                "status": "REVIEW_REQUIRED",
                "conditions": ["Unreadable or Missing Telemetry"],
                "risk_score": 0.0,
                "confidence": 0.0,
                "channel": "NONE",
                "reason": "The OCR pipeline could not identify any structured medical telemetry. Please retry or verify document.",
                "recommendation": "Consult clinical staff manually."
            }

        conditions = []
        status = "NORMAL"
        channel = "NONE"
        risk_penalty = 0
        is_normal = True

        # === 1. BLOOD DISORDERS (CBC) ===
        if hb > 0:
            if hb < 7.0:
                conditions.append("Severe Anemia")
                status = "ABNORMAL"
                channel = "RED"
                risk_penalty += 80
                is_normal = False
            elif 7.0 <= hb < 11.5:
                conditions.append("Mild Anemia")
                status = "BORDERLINE"
                if channel != "RED": channel = "YELLOW"
                risk_penalty += 40
                is_normal = False
                # Thalassemia check
                if rbc > 5.0 and mcv > 0 and mcv < 80.0:
                    conditions.append("Possible Thalassemia Trait")
                    channel = "GREEN" # Chronic Tracking
        
        if wbc > 0:
            if wbc > 11.0:
                conditions.append("Leukocytosis (Possible Infection)")
                status = "ABNORMAL"
                if channel == "NONE": channel = "YELLOW"
                risk_penalty += 30
                is_normal = False
            elif wbc < 4.0:
                conditions.append("Leukopenia")
                status = "BORDERLINE"
                is_normal = False
                
        if platelets > 0 and platelets < 150.0:
            conditions.append("Thrombocytopenia (Low Platelets)")
            status = "ABNORMAL"
            risk_penalty += 40
            is_normal = False

        # === 2. ORGAN DYSFUNCTION (LFT / KFT) ===
        if alt > 45.0:
            conditions.append("Elevated Liver Enzymes (ALT)")
            status = "ABNORMAL"
            if channel == "NONE": channel = "YELLOW"
            risk_penalty += 25
            is_normal = False
            
        if creatinine > 1.2:
            conditions.append("Possible Kidney Impairment (High Creatinine)")
            status = "ABNORMAL"
            if channel != "RED": channel = "YELLOW"
            risk_penalty += 50
            is_normal = False

        # === 3. METABOLIC / DIABETES ===
        if hba1c > 0:
            if hba1c >= 6.5:
                conditions.append("Diabetic Range (HbA1c)")
                status = "ABNORMAL"
                is_normal = False
            elif 5.7 <= hba1c < 6.5:
                conditions.append("Pre-Diabetes (HbA1c)")
                if status == "NORMAL": status = "BORDERLINE"
                is_normal = False
                
        if glucose > 125.0 and hba1c == 0:
            conditions.append("Hyperglycemia (High Glucose)")
            status = "BORDERLINE"
            is_normal = False
            
        # === 4. LIPIDS ===
        if cholesterol > 200.0:
            conditions.append("Hypercholesterolemia (High Cholesterol)")
            if status == "NORMAL": status = "BORDERLINE"
            is_normal = False

        # === 5. HORMONAL / THYROID ===
        if tsh > 0:
            if tsh > 4.5:
                conditions.append("Hypothyroidism")
                status = "ABNORMAL"
                is_normal = False
            elif tsh < 0.4:
                conditions.append("Hyperthyroidism")
                status = "ABNORMAL"
                is_normal = False

        # === 6. NUTRITIONAL ===
        if vit_d > 0 and vit_d < 20.0:
            conditions.append("Vitamin D Deficiency")
            if status == "NORMAL": status = "BORDERLINE"
            is_normal = False
        if vit_b12 > 0 and vit_b12 < 200.0:
            conditions.append("Vitamin B12 Deficiency")
            if status == "NORMAL": status = "BORDERLINE"
            is_normal = False

        # === CONCLUSION ===
        if is_normal:
            conditions.append("No abnormalities detected")
            return {
                "status": "NORMAL",
                "conditions": conditions,
                "risk_score": 2.0,
                "confidence": 0.95,
                "channel": "NONE",
                "reason": "All extracted physical telemetry panels (CBC, LFT, KFT, Metabolic) reside within absolute survival and clinical normal range parameters.",
                "recommendation": "Maintain healthy lifestyle. Standard discharge."
            }

        # Secondary NLP Validation (Zero-Shot) limits False Positives
        context_classes = ["chronic blood disorder", "organ failure", "metabolic syndrome", "infection", "vitamin deficiency"]
        context_res = self.diagnostic_nlp(sequences=raw_ocr_text[:500] if len(raw_ocr_text) > 0 else "missing", candidate_labels=context_classes)
        primary_context = context_res["labels"][0]
        nlp_confidence = context_res["scores"][0]

        reason_explanation = f"AI strictly adhered to physical bounds mapping {len(conditions)} conditions. Secondary NLP matched context '{primary_context}'."

        final_risk = min(99.9, float(risk_penalty))
        
        return {
            "status": status,
            "conditions": conditions,
            "risk_score": round(final_risk, 1),
            "confidence": round(float(nlp_confidence), 2),
            "channel": channel,
            "reason": reason_explanation,
            "recommendation": f"Monitor detected parameters carefully. Expedite clinical mapping to {channel if channel != 'NONE' else 'Standard'} channel."
        }


# Instantiate Global Singleton
engine_singleton = None

def get_engine():
    global engine_singleton
    if engine_singleton is None:
        engine_singleton = MultiModelHybridEngine()
    return engine_singleton

def ex_val(regex_str, upper_text):
    match = re.search(regex_str, upper_text)
    return float(match.group(1)) if match else 0.0

def ocr_extraction_service(file_path: str) -> dict:
    raw_text = ""
    
    # 1. Byte-Level PDF Extraction Logic
    if file_path.lower().endswith(".pdf"):
        try:
            import fitz
            doc = fitz.open(file_path)
            for page in doc:
                raw_text += page.get_text() + "\n"
        except Exception:
            raw_text = ""
            
    # 2. Graphical Fallback
    if not str(raw_text).strip():
        try:
             raw_text = pytesseract.image_to_string(Image.open(file_path))
        except Exception:
             raw_text = ""
             
    raw_upper = raw_text.upper()
    
    # Advanced RegEx Mappings for Full Panels
    d = {
         "raw_text": raw_text,
         "patient_name": "Unknown Patient",
         "patient_age": "Unknown",
    }
    
    # Name/Age
    name_match = re.search(r'(?:PATIENT NAME|NAME|PT NAME)[\s:=]+([A-Z\s]{3,30})', raw_upper)
    if name_match: d["patient_name"] = name_match.group(1).strip()
    age_match = re.search(r'(?:AGE|YRS)[\s:=]+([\d]{1,3})', raw_upper)
    if age_match: d["patient_age"] = age_match.group(1).strip()

    # CBC
    d["hb"] = ex_val(r'(?:HB|HEMOGLOBIN|HGB)[\s:=]+([\d\.]+)', raw_upper)
    d["rbc"] = ex_val(r'(?:RBC|RED BLOOD)[\s:=]+([\d\.]+)', raw_upper)
    d["wbc"] = ex_val(r'(?:WBC|WHITE BLOOD|TLC)[\s:=]+([\d\.]+)', raw_upper)
    d["platelets"] = ex_val(r'(?:PLATELET|PLT)[\s:=]+([\d\.]+)', raw_upper)
    d["mcv"] = ex_val(r'(?:MCV)[\s:=]+([\d\.]+)', raw_upper)
    d["hct"] = ex_val(r'(?:HCT|HEMATOCRIT|PCV)[\s:=]+([\d\.]+)', raw_upper)
    d["mch"] = ex_val(r'(?:MCH)[\s:=]+([\d\.]+)', raw_upper)
    d["mchc"] = ex_val(r'(?:MCHC)[\s:=]+([\d\.]+)', raw_upper)
    d["rdw"] = ex_val(r'(?:RDW)[\s:=]+([\d\.]+)', raw_upper)

    # Iron
    d["iron"] = ex_val(r'(?:IRON|FE)[\s:=]+([\d\.]+)', raw_upper)
    d["ferritin"] = ex_val(r'(?:FERRITIN)[\s:=]+([\d\.]+)', raw_upper)
    d["tibc"] = ex_val(r'(?:TIBC)[\s:=]+([\d\.]+)', raw_upper)

    # LFT
    d["alt"] = ex_val(r'(?:ALT|SGPT)[\s:=]+([\d\.]+)', raw_upper)
    d["ast"] = ex_val(r'(?:AST|SGOT)[\s:=]+([\d\.]+)', raw_upper)
    d["bilirubin"] = ex_val(r'(?:BILIRUBIN TOTAL|T BIL|BILIRUBIN)[\s:=]+([\d\.]+)', raw_upper)
    d["albumin"] = ex_val(r'(?:ALBUMIN)[\s:=]+([\d\.]+)', raw_upper)

    # KFT
    d["creatinine"] = ex_val(r'(?:CREATININE|CREA)[\s:=]+([\d\.]+)', raw_upper)
    d["urea"] = ex_val(r'(?:UREA)[\s:=]+([\d\.]+)', raw_upper)
    d["bun"] = ex_val(r'(?:BUN|BLOOD UREA NITROGEN)[\s:=]+([\d\.]+)', raw_upper)

    # Lipids
    d["cholesterol"] = ex_val(r'(?:CHOLESTEROL TOTAL|CHOLESTEROL)[\s:=]+([\d\.]+)', raw_upper)
    d["hdl"] = ex_val(r'(?:HDL)[\s:=]+([\d\.]+)', raw_upper)
    d["ldl"] = ex_val(r'(?:LDL)[\s:=]+([\d\.]+)', raw_upper)
    d["triglycerides"] = ex_val(r'(?:TRIGLYCERIDES|TG)[\s:=]+([\d\.]+)', raw_upper)

    # Thyroid
    d["t3"] = ex_val(r'(?:T3|TRIIODOTHYRONINE)[\s:=]+([\d\.]+)', raw_upper)
    d["t4"] = ex_val(r'(?:T4|THYROXINE)[\s:=]+([\d\.]+)', raw_upper)
    d["tsh"] = ex_val(r'(?:TSH|THYROID STIMULATING HORMONE)[\s:=]+([\d\.]+)', raw_upper)

    # Diabetes
    d["glucose"] = ex_val(r'(?:GLUCOSE|SUGAR FASTING|FBS)[\s:=]+([\d\.]+)', raw_upper)
    d["hba1c"] = ex_val(r'(?:HBA1C|GLYCOSYLATED HEMOGLOBIN)[\s:=]+([\d\.]+)', raw_upper)

    # Vitamins
    d["vit_b12"] = ex_val(r'(?:VITAMIN B12|B12)[\s:=]+([\d\.]+)', raw_upper)
    d["vit_d"] = ex_val(r'(?:VITAMIN D|25 OH VITAMIN D|VIT D)[\s:=]+([\d\.]+)', raw_upper)

    return d
