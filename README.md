<div align="center">

<img src="frontend/public/RAKTAVA-Logo-Witout-Background.png" alt="RAKTAVA Logo" width="500" />

### **AI-Powered Blood Intelligence & Patient Support Platform**
*Transforming Clinical Telemetry and Logistics Into Life-Saving Decisions.*

[![Next.js](https://img.shields.io/badge/Next.js-16--Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-TypeScript-333333?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

[Features](#-key-features) •
[Architecture](#-system-architecture) •
[Installation](#-local-installation) •
[Security & Compliance](#-security--encryption) •
[Production Hardening](#-production-candidate-pc-1)

</div>

---

## 🌟 Key Features

*   **🧠 RAKTAVA Medical Intelligence Engine:** Real-time upload and parameter extraction (Hemoglobin, RBC, WBC, Platelets) from clinical blood panel PDFs/Images.
*   **📊 AI Demand Forecast Curve:** Integrated interactive analytics (`Recharts`) modeling local supply and forecasting O- / A+ demand surges.
*   **🚨 Override Emergency SOS:** Location-aware paramedic dispatch override engine and instant hospital trauma routing.
*   **🔐 Row-Level Cryptography:** Application-side `AES-256-GCM` encryption protecting patient PHI and demographic data in PostgreSQL databases.
-   **📈 Modular Dashboard Panel:** Fully decoupled switches serving B2B Hospital Command views alongside B2C Patient Eligibility views.

---

## 🏗 System Architecture

```text
RAKTAVA (Root Workspace)
├── backend/                       # Express Node.js & REST API Gateway
│   ├── prisma/                    # Relational Database Models & Seeding Scripts
│   ├── src/
│   │   ├── config/                # Environment variables and DB connectors
│   │   ├── middlewares/           # HttpOnly Session Auth & Magic Byte File Verification
│   │   ├── modules/               # Domain modules (auth, requests, analytics, health)
│   │   └── utils/                 # Symmetric AES-256-GCM helpers
│   └── tsconfig.json              # TypeScript compilation overrides
│
├── frontend/                      # Next.js 16 Client App (Turbopack)
│   ├── public/                    # Global RAKTAVA brand assets & logos
│   └── src/
│       ├── app/                   # App Router structure (marketing & dashboard pages)
│       ├── components/            # Navbars, footers, charts, and RAKTAVA AI Bot
│       └── lib/                   # API HTTP client wrapper
│
└── docs/                          # Architecture blueprints & operational manuals
    ├── security_audit_report.md   # HIPAA & IEEE verification matrix
    └── user_manual.md             # Systems operational guides
```

---

## 🚀 Local Installation

Follow these steps to initialize RAKTAVA for demo, MVP presentation, or development testing:

### 1. Database & Secrets Setup
Create a `.env` file inside `backend/` and configure your credentials:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_KEY@ep-pooler.us-east-1.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-production-secret-token"
ENCRYPTION_KEY="your-32-char-aes-encryption-key"
```

### 2. Start the Backend API Server
```bash
cd backend
npm install
npx prisma db push      # Sync schemas to PostgreSQL
npm run seed            # Populate standard logs, triage metrics, and hospitals
npm run dev
```
*The REST API Gateway starts on `http://localhost:8000`.*

### 3. Start the Next.js Frontend App
```bash
cd ../frontend
npm install
npm run dev
```
*The RAKTAVA web application broadcasts on `http://localhost:3000`.*

---

## 🛡️ Security & Encryption

RAKTAVA is built in strict adherence to **HIPAA** and **IEEE 29147** vulnerability standards:
1.  **Field-Level PHI Protection:** Patient names, email ids, and conditions are encrypted before write transactions in PostgreSQL.
2.  **HttpOnly JWT Session Storage:** Authentication keys are stored strictly inside secure, loopback cookies to neutralize Cross-Site Scripting (XSS).
3.  **Upload File Sanity Checker:** Analyzes binary file headers (magic bytes) during multipart ingestion to prevent executable script injection.

---

## 🏆 Production Candidate (PC-1)

The system has been promoted to **PC-1** status, compiling with **100% success** on Next.js 16 (Turbopack) environments. 

For deployment to Vercel, the configuration handles redirection via `vercel.json` routing rules:
```json
{
  "buildCommand": "NODE_ENV=production npm run build --prefix frontend",
  "installCommand": "npm install --prefix frontend",
  "outputDirectory": "frontend/.next"
}
```
*(Forces production React compilation paths to bypass non-standard environment errors during page data optimization).*
