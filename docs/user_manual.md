# Hemo-Sync SaaS - System User Guide & Operations Manual
**Version:** 1.0.0  
**Target Audience:** Clinical Users, Administrators, and Systems Engineers  

---

## 1. Introduction

**Hemo-Sync** is an enterprise-grade healthcare SaaS platform designed for regional blood bank logistics coordination, real-time clinical patient risk triage, and automated supply routing.

The system utilizes an offline local **Python AI Daemon** (zero-shot transformers + XGBoost regressions) combined with a **Clinical Rule Engine** to compute priority scores and route emergency demands to matching regional blood repositories using a FIFO + Haversine distance algorithm.

---

## 2. Directory Hierarchy

The project codebase is organized into clean, modular, and logically separated subdirectories:

```text
blood-bank-intelligence/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # PostgreSQL Models & Enums
│   │   └── seed.ts            # Database Seeding Script
│   ├── src/
│   │   ├── config/            # Database Connection, Logger, and Env Config
│   │   ├── middlewares/       # Auth (JWT/Cookie), Upload (magic byte checks), RateLimit
│   │   ├── modules/
│   │   │   ├── auth/          # Login, Registration, Token Refresh routes
│   │   │   ├── ai/            # Ingestion OCR service & Warm Daemon handlers
│   │   │   ├── requests/      # Triage calculations, Auto-Patient Resolution, routing
│   │   │   ├── analytics/     # Dashboard statistics & demand forecasts
│   │   │   └── health/        # Health and readiness check controllers
│   │   ├── utils/             # AES-256-GCM PHI Encryption, JWT helpers
│   │   ├── app.ts             # Express App middleware configurations
│   │   └── server.ts          # Server entry script
│   ├── legacy/                # Deprecated FastAPI python script archive
│   ├── credentials.txt        # Secure placeholders configuration template
│   ├── requirements.txt       # Python environment dependencies
│   ├── package.json           # Node.js dependencies and run scripts
│   └── tsconfig.json          # TypeScript configurations
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router (marketing & dashboard pages)
│   │   ├── components/        # Layouts, UI modules, and analytics charts
│   │   └── lib/               # Shared API client helpers (apiFetch)
│   ├── next.config.ts         # Next config with Vercel Same-Origin rewrite proxy
│   ├── package.json           # Next.js configurations
│   └── postcss.config.mjs     # PostCSS styling setup
└── docs/
    ├── security_audit_report.md  # HIPAA & OWASP security validation report
    └── user_manual.md            # System user guide & startup steps (this file)
```

---

## 3. Startup & Local Execution Guide

To run the application locally on a development machine:

### A. Python AI Daemon Setup
1. Open a terminal in the `backend/` directory.
2. Initialize or activate the Python virtual environment:
   ```bash
   .\venv\Scripts\activate
   ```
3. Run the warm-up AI daemon:
   ```bash
   python src/modules/ai/ai_daemon.py
   ```
   *The models will load locally. The microservice daemon runs on `http://127.0.0.1:8081`.*

### B. Node.js Express Backend Setup
1. Open a second terminal in the `backend/` directory.
2. Install dependencies (if first run):
   ```bash
   npm install
   ```
3. Sync your database schema with the Neon PostgreSQL database:
   ```bash
   npx prisma db push
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The Express gateway runs on `http://localhost:8000`.*

### C. Next.js Frontend Setup
1. Open a third terminal in the `frontend/` directory.
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend client runs on `http://localhost:3000`.*

---

## 4. Key Workflows & User Guides

### Workflow 1: Lab Report Ingestion (OCR & Parameter Extraction)
1. Log in to the portal using your institutional credentials.
2. Navigate to the **Report Analyzer** page (`/dashboard/analyzer`).
3. Under **Document OCR**, drag and drop a clinical blood panel (PDF or Image, max 10MB) into the upload container.
4. The system automatically reads magic bytes for safety, uploads the file, and runs PyMuPDF/pytesseract to extract Hemoglobin, RBC, WBC, Platelets, Creatinine, Glucose, and other telemetry.
5. Review the extracted parameters and interactive graphs on the completed dashboard screen.

### Workflow 2: Dispatching Triage Requests (Logistics Routing)
1. On the completed analysis results screen, locate the **Logistics Triage Dispatch** panel in the right sidebar.
2. Confirm the patient's parsed blood group and input the desired units required for clinical requisition (e.g. `2` units).
3. Click **Dispatch Requisition**.
4. The system automatically looks up the patient in the database (creating their record under the hospital node if they don't exist), computes the AI priority score, and schedules the demand.
5. Navigate to **System Requisitions** (`/dashboard/requests`) to view the real-time priority queue.
