<div align="center">

# RAKTAVA AI-Powered Blood Intelligence Platform
**Transforming Blood Intelligence Into Life-Saving Decisions**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-Node-333333?style=for-the-badge&logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

RAKTAVA is an intelligent blood management and patient support platform that leverages AI, clinical rules, and healthcare analytics to improve blood availability, patient prioritization, and medical decision support.

[Core Features](#-features) •
[Architecture](#-architecture) •
[Getting Started](#-getting-started) •
[Documentation](#-api-documentation)

</div>

---

## ✨ Features

- **🧠 Patient Triage AI:** Predicts absolute trauma priority scores using Scikit-Learn logic analyzing Hemoglobin levels and specific Disease States instantly.
- **📊 Real-time Demand Forecasting:** Interactive area charts (`Recharts`) demonstrating predictive blood shortage timelines days before they occur.
- **🔐 Multi-Role Architecture:** Fully separated portal routes supporting B2B Hospitals alongside B2C Patient tracking utilizing strict Express JWT implementations.
- **⚡ Surgical UI/UX:** Built with Tailwind CSS & Framer Motion atop Next.js resulting in ultra-fast, animated, fluid navigational states supporting Dark & Light Modes natively.

---

## 🏗 Architecture

RAKTAVA is structured as a powerful decoupled Monorepo.

> ✅ **Frontend (Client):** Next.js 16 App Router, seamlessly rendering B2B marketing channels, animated Dashboards, and Interactive AI Chatbots simultaneously.  
> ✅ **Backend (API + ML Engine):** Express.js & TypeScript handling JWT Auth validation, heavy predictive algorithmic sorting, and rapid database queries.  
> ✅ **Database:** Prisma + PostgreSQL database ensuring safe execution and GCM AES-256 field-level encryption for PII/PHI fields.

---

## 🚀 Getting Started

To run the full infrastructure suite locally on your machine, both the Frontend and Backend servers must be booted in separate terminal windows.

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Initialize API Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
> The API will now stream locally on `http://localhost:8000`.

### 2. Initialize SaaS Interface (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
> The Platform is now broadcasting at `http://localhost:3000`.

---

## 📁 Repository Structure

```graphql
RAKTAVA/
├── backend/                       # Express Node.js & REST API Core
│   ├── src/
│   │   ├── modules/               # Domain-driven backend modules
│   │   ├── utils/                 # Encryption & telemetry helpers
│   │   └── index.ts               # Server Entrypoint
│   └── prisma/                    # Prisma DB schema & migration configs
│
└── frontend/                      # Next.js Application
    ├── public/                    # Static UI Assets & Logos
    └── src/
        ├── app/
        │   ├── (auth)/            # Split-Screen JWT Login/Signup 
        │   ├── (marketing)/       # B2B Patient/Hospital Overviews
        │   └── dashboard/         # Core Interactive Analytics Pane
        └── components/            # Global Navbars, Footers, and AiBots
```

---

<div align="center">
<i>Surgically constructed for healthcare scalability.</i>
</div>
