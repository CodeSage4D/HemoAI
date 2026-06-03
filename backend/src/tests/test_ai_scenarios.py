import sys
import os
import json

# Ensure project root is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(os.path.join(current_dir, "../../")))

try:
    import ai_engine
except ImportError as e:
    print(f"Failed to import ai_engine: {e}")
    sys.exit(1)

def run_test(name, payload):
    print(f"RUNNING TEST: {name}...")
    try:
        engine = ai_engine.get_engine()
        result = engine.run_ensemble(payload)
        print(f"RESULT: {json.dumps(result, indent=2)}")
        return result
    except Exception as e:
        print(f"ERROR executing test {name}: {e}")
        return None

def main():
    print("====================================================")
    print("        AI SCENARIO CLINICAL VALIDATION             ")
    print("====================================================")

    # 1. Normal Health Report
    normal_payload = {
        "raw_text": "Routine checkup patient feels perfectly fine. Blood counts normal.",
        "hb": 14.5, "rbc": 5.2, "wbc": 7.0, "platelets": 250.0, "mcv": 88.0, "hct": 42.0,
        "alt": 25.0, "ast": 22.0, "creatinine": 0.9, "bilirubin": 0.8,
        "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0, "ldl": 100.0,
        "tsh": 2.1, "vit_d": 35.0, "vit_b12": 450.0
    }
    r_normal = run_test("Normal Health Baseline", normal_payload)
    assert r_normal["status"] == "NORMAL", "Normal check failed"

    # 2. Mild Anemia (Normocytic)
    mild_payload = {
        "raw_text": "Patient reports mild fatigue during morning runs.",
        "hb": 10.5, "rbc": 4.0, "wbc": 6.5, "platelets": 220.0, "mcv": 90.0, "hct": 32.0,
        "alt": 25.0, "creatinine": 0.9, "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0,
        "tsh": 2.1, "vit_d": 35.0
    }
    r_mild = run_test("Mild Anemia (Normocytic)", mild_payload)
    assert r_mild["status"] == "BORDERLINE", "Mild Anemia status check failed"
    assert "Normocytic Anemia" in r_mild["conditions"] or "Mild Anemia" in r_mild["conditions"], "Anemia condition check failed"

    # 3. Severe Anemia (Emergency Channel RED)
    severe_payload = {
        "raw_text": "Emergency ward patient with severe dizziness and bleeding.",
        "hb": 6.2, "rbc": 2.5, "wbc": 8.0, "platelets": 180.0, "mcv": 85.0,
        "alt": 25.0, "creatinine": 0.9, "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0,
        "tsh": 2.1, "vit_d": 35.0
    }
    r_severe = run_test("Severe Anemia", severe_payload)
    assert r_severe["status"] == "ABNORMAL", "Severe Anemia status check failed"
    assert r_severe["channel"] == "RED", "Severe Anemia priority channel check failed"
    assert "Severe Anemia" in r_severe["conditions"], "Severe Anemia condition check failed"

    # 4. Microcytic Anemia (Suggesting Thalassemia / Iron deficiency)
    thal_payload = {
        "raw_text": "Patient with persistent fatigue. Microcytic presentation.",
        "hb": 9.5, "rbc": 4.1, "wbc": 6.0, "platelets": 200.0, "mcv": 72.0,
        "alt": 25.0, "creatinine": 0.9, "hba1c": 5.2, "glucose": 85.0, "cholesterol": 180.0,
        "tsh": 2.1, "vit_d": 35.0
    }
    r_thal = run_test("Microcytic Anemia / Thalassemia Indicator", thal_payload)
    assert "Microcytic Anemia" in r_thal["conditions"], "Microcytic Anemia condition check failed"

    # 5. Empty / Corrupted PDF / Non-Medical File
    corrupt_payload = {
        "raw_text": "Empty document. Cannot parse parameters.",
        "hb": 0.0, "rbc": 0.0, "wbc": 0.0, "platelets": 0.0, "mcv": 0.0,
        "alt": 0.0, "creatinine": 0.0, "hba1c": 0.0, "cholesterol": 0.0,
        "tsh": 0.0, "vit_d": 0.0
    }
    r_corrupt = run_test("Corrupted or Non-Medical File", corrupt_payload)
    assert r_corrupt["status"] == "REVIEW_REQUIRED", "Corrupted file check failed"
    assert r_corrupt["channel"] == "NONE", "Corrupted file channel check failed"

    print("====================================================")
    print("      ALL AI VALIDATION SCENARIO TESTS PASSED       ")
    print("====================================================")

if __name__ == "__main__":
    main()
