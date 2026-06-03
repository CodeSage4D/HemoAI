import pytest
import ai_engine

def test_normal_health_baseline():
    engine = ai_engine.get_engine()
    payload = {
        "raw_text": "Routine checkup patient feels perfectly fine. Blood counts normal.",
        "hb": 14.5, "rbc": 5.2, "wbc": 7.0, "platelets": 250.0, "mcv": 88.0, "hct": 42.0,
        "alt": 25.0, "ast": 22.0, "creatinine": 0.9, "bilirubin": 0.8,
        "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0, "ldl": 100.0,
        "tsh": 2.1, "vit_d": 35.0, "vit_b12": 450.0
    }
    res = engine.run_ensemble(payload)
    assert res["status"] == "NORMAL"

def test_mild_anemia():
    engine = ai_engine.get_engine()
    payload = {
        "raw_text": "Patient reports mild fatigue during morning runs.",
        "hb": 10.5, "rbc": 4.0, "wbc": 6.5, "platelets": 220.0, "mcv": 90.0, "hct": 32.0,
        "alt": 25.0, "creatinine": 0.9, "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0,
        "tsh": 2.1, "vit_d": 35.0
    }
    res = engine.run_ensemble(payload)
    assert res["status"] == "BORDERLINE"
    assert any(c in res["conditions"] for c in ["Normocytic Anemia", "Mild Anemia"])

def test_severe_anemia():
    engine = ai_engine.get_engine()
    payload = {
        "raw_text": "Emergency ward patient with severe dizziness and bleeding.",
        "hb": 6.2, "rbc": 2.5, "wbc": 8.0, "platelets": 180.0, "mcv": 85.0,
        "alt": 25.0, "creatinine": 0.9, "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0,
        "tsh": 2.1, "vit_d": 35.0
    }
    res = engine.run_ensemble(payload)
    assert res["status"] == "ABNORMAL"
    assert res["channel"] == "RED"
    assert "Severe Anemia" in res["conditions"]

def test_microcytic_anemia():
    engine = ai_engine.get_engine()
    payload = {
        "raw_text": "Patient with persistent fatigue. Microcytic presentation.",
        "hb": 9.5, "rbc": 4.1, "wbc": 6.0, "platelets": 200.0, "mcv": 72.0,
        "alt": 25.0, "creatinine": 0.9, "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0,
        "tsh": 2.1, "vit_d": 35.0
    }
    res = engine.run_ensemble(payload)
    assert "Microcytic Anemia" in res["conditions"]

def test_corrupted_or_non_medical():
    engine = ai_engine.get_engine()
    payload = {
        "raw_text": "Empty document. Cannot parse parameters.",
        "hb": 0.0, "rbc": 0.0, "wbc": 0.0, "platelets": 0.0, "mcv": 0.0,
        "alt": 0.0, "creatinine": 0.0, "hba1c": 0.0, "cholesterol": 0.0,
        "tsh": 0.0, "vit_d": 0.0
    }
    res = engine.run_ensemble(payload)
    assert res["status"] == "REVIEW_REQUIRED"
    assert res["channel"] == "NONE"
