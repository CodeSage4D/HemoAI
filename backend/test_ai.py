import pytest
from ai_engine import MultiModelHybridEngine, get_engine
import numpy as np

def test_engine_initialization():
    engine = get_engine()
    assert engine is not None
    assert hasattr(engine, "diagnostic_nlp")
    assert hasattr(engine, "xgb_model")

def test_hard_red_override():
    engine = get_engine()
    # High Hb but severe tragedy should force RED via severity index
    res = engine.run_ensemble("Severe trauma and massive hemorrhage observed.", 12.0)
    assert res["channel"] == "RED", "Failed: Trauma override should force RED."
    
def test_hard_hb_red_override():
    engine = get_engine()
    # Routine doc but fatal Hb level
    res = engine.run_ensemble("Routine standard observation. Patient stable.", 4.1)
    assert res["channel"] == "RED", "Failed: Fatal Hb override should force RED."
    assert "RULE ENGINE OVERRIDE" in res["reason"]

def test_green_chronic_override():
    engine = get_engine()
    res = engine.run_ensemble("Monthly observation for Thalassemia major.", 10.5)
    assert res["channel"] == "GREEN", "Failed: Thalassemia should route to GREEN."
    assert "Thalassemia" in res["disease"]
    
def test_yellow_standard_flow():
    engine = get_engine()
    res = engine.run_ensemble("Routine physical. No issues.", 13.0)
    assert res["channel"] == "YELLOW", "Failed: Routine metrics should route to YELLOW."
