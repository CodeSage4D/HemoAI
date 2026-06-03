from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
import ai_engine
import schemas
from dependencies import get_current_user, limiter
from logger import logger

router = APIRouter(prefix="/ai", tags=["AI Operations"])

@router.post("/ocr-service")
@limiter.limit("5/minute")
async def ocr_service(request: Request, file: UploadFile = File(...)):
    import tempfile, os, shutil
    
    logger.info(f"Incoming OCR request for file: {file.filename} ({file.content_type})")
    
    # SECURITY: Magic Byte / File Signature Validation Limit
    if file.size > 10 * 1024 * 1024:
        logger.warning(f"File too large: {file.size} bytes")
        raise HTTPException(status_code=413, detail="File absolutely too large for OCR limits.")
        
    allowed_mimetypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"]
    if file.content_type not in allowed_mimetypes:
        logger.warning(f"Unsupported file type: {file.content_type}")
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Expected PDF or strict graphical format.")

    import mimetypes
    ext = mimetypes.guess_extension(file.content_type) or ".png"
    if file.filename.endswith('.pdf') or file.content_type == "application/pdf": ext = ".pdf"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    from fastapi.concurrency import run_in_threadpool
    import asyncio
    try:
        logger.debug(f"Offloading OCR to threadpool: {tmp_path}")
        extracted = await asyncio.wait_for(run_in_threadpool(ai_engine.ocr_extraction_service, tmp_path), timeout=30.0)
        logger.success(f"OCR successfully extracted {len(extracted.get('raw_text', ''))} characters")
    except asyncio.TimeoutError:
        logger.error("OCR extraction timed out after 30 seconds")
        raise HTTPException(status_code=504, detail="OCR abstraction service timed out.")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
    
    return extracted

# Assuming MLOpsRequest is in schemas now... Wait, main.py defined MLOpsRequest inline. Let me define it here directly if it's not in schemas.
class MLOpsRequest(schemas.BaseModel):
    raw_text: str = ""
    patient_name: str | None = "Unknown Patient"
    patient_age: str | None = "Unknown"
    hb: float = 0.0
    rbc: float = 0.0
    wbc: float = 0.0
    platelets: float = 0.0
    mcv: float = 0.0
    hct: float = 0.0
    mch: float = 0.0
    mchc: float = 0.0
    rdw: float = 0.0
    iron: float = 0.0
    ferritin: float = 0.0
    tibc: float = 0.0
    alt: float = 0.0
    ast: float = 0.0
    bilirubin: float = 0.0
    albumin: float = 0.0
    creatinine: float = 0.0
    urea: float = 0.0
    bun: float = 0.0
    cholesterol: float = 0.0
    hdl: float = 0.0
    ldl: float = 0.0
    triglycerides: float = 0.0
    t3: float = 0.0
    t4: float = 0.0
    tsh: float = 0.0
    glucose: float = 0.0
    hba1c: float = 0.0
    vit_b12: float = 0.0
    vit_d: float = 0.0

@router.post("/final-engine")
@limiter.limit("10/minute")
async def final_mlops_engine(request: Request, payload: MLOpsRequest):
    logger.info(f"Incoming Final Engine request for patient {payload.patient_name}")
    engine = ai_engine.get_engine()
    
    from fastapi.concurrency import run_in_threadpool
    logger.debug("Offloading MultiModelHybridEngine to threadpool.")
    result_matrix = await run_in_threadpool(
         engine.run_ensemble, 
         payload.model_dump()
    )
    logger.success(f"MultiModel Engine Matrix Calculated. Status: {result_matrix.get('status')}")
    return result_matrix
