from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from logger import logger
import time

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

class RequestTimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        logger.info(f"Incoming request: {request.method} {request.url.path}")
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            logger.info(f"Completed {request.method} {request.url.path} in {process_time:.2f}ms with status {response.status_code}")
            return response
        except Exception as e:
            logger.error(f"Failed {request.method} {request.url.path}: {e}")
            raise
