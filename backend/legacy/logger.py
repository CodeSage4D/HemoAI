import sys
import os
from loguru import logger

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

# Remove default logger
logger.remove()

# Add console logger
logger.add(sys.stderr, colorize=True, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")

# Add file logger (rotating)
logger.add("logs/app.log", rotation="10 MB", retention="10 days", level="INFO", format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}")
