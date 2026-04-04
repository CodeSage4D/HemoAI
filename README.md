# HemoAI

HemoAI is a state-of-the-art intelligent medical blood bank infrastructure. It aims to eliminate logistical blood shortages by matching critical supply to priority patients with precision AI intelligence.

## Architecture

The project maintains a monorepo structure separating frontend clients from the AI API server:

- `/frontend` - Next.js App Router providing marketing schemas and authorized dash components.
- `/backend` - FastAPI Python API utilizing PyJWT authentication, SQLAlchemy structures, and ML-Pipelines simulating Scikit-Learn logic.

### Quick Start

**Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Platform initialized via AI.
