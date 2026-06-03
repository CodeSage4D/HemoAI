from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

import models
from database import engine, get_db
from logger import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from middleware import SecurityHeadersMiddleware, RequestTimingMiddleware
from dependencies import limiter

# Routers
from routers import auth, ai_ops, logistics, metrics

# Initialize Database Schema
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blood Bank Intelligence API", version="3.0.0 (Modular)")

# Add Rate Limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Middleware Sequence
app.add_middleware(RequestTimingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global Server Error mapping {request.url}: {exc}")
    # Return safe error instead of crashing stack traces
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )

# Map Routers
app.include_router(auth.router)
app.include_router(ai_ops.router)
app.include_router(logistics.router)
app.include_router(metrics.router)


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "backend": "running", "database": "connected"}
    except Exception as e:
        logger.error(f"Healthcheck DB Failure: {e}")
        return JSONResponse(status_code=503, content={"status": "error", "detail": str(e)})


@app.on_event("startup")
async def startup_event():
    import os
    logger.info("Initializing ASGI Lifespan & ML Offline Checks")
    
    model_path_context = os.path.abspath(os.path.join(os.path.dirname(__file__), "local_models", "distilbert"))
    model_path_ner = os.path.abspath(os.path.join(os.path.dirname(__file__), "local_models", "bertner"))
    
    if not os.path.exists(model_path_context) or not os.path.exists(model_path_ner):
        logger.warning("First Run Detected: Fetching Physical Models for True Offline Execution...")
        os.environ["TRANSFORMERS_OFFLINE"] = "0" 
        from transformers import pipeline
        
        os.makedirs(model_path_context, exist_ok=True)
        os.makedirs(model_path_ner, exist_ok=True)
        
        logger.info("Downloading Context Model (Model 1)...")
        c_pipeline = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
        c_pipeline.model.save_pretrained(model_path_context)
        c_pipeline.tokenizer.save_pretrained(model_path_context)
        
        logger.info("Downloading NER Pathology Model (Model 2)...")
        n_pipeline = pipeline("ner", aggregation_strategy="simple", model="dbmdz/bert-large-cased-finetuned-conll03-english")
        n_pipeline.model.save_pretrained(model_path_ner)
        n_pipeline.tokenizer.save_pretrained(model_path_ner)
        
        os.environ["TRANSFORMERS_OFFLINE"] = "1"
        logger.success("Physical Machine Learning Shards Fully Hardcoded. Server safely air-gapped.")

    logger.info("Initiating ML Pre-flight Warmup...")
    import ai_engine
    engine = ai_engine.get_engine()
    logger.success("Warmup Successful. Offline Pipeline Ready.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
