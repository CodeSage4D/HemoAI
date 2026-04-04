<div align="center">

# 🩸 Hemo-Sync Intelligence Systems
**The Future of AI-Powered Blood Management & Patient Triage**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-AI-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

Hemo-Sync is a modern, enterprise-grade healthcare SaaS platform designed to eliminate logistical blood shortages by matching critical supply to priority patients using precision AI intelligence.

[Core Features](#-features) •
[Architecture](#-architecture) •
[Getting Started](#-getting-started) •
[Documentation](#-api-documentation)

</div>

---

## ✨ Features

- **🧠 Patient Triage AI:** Predicts absolute trauma priority scores using Scikit-Learn logic analyzing Hemoglobin levels and specific Disease States instantly.
- **📊 Real-time Demand Forecasting:** Interactive area charts (`Recharts`) demonstrating predictive blood shortage timelines days before they occur.
- **🔐 Multi-Role Architecture:** Fully separated portal routes supporting B2B Hospitals alongside B2C Patient tracking utilizing strict Fast-API JWT implementations.
- **⚡ Surgical UI/UX:** Built with Tailwind CSS & Framer Motion atop Next.js resulting in ultra-fast, animated, fluid navigational states supporting Dark & Light Modes natively.

---

## 🏗 Architecture

Hemo-Sync is structured as a powerful decoupled Monorepo.

> ✅ **Frontend (Client):** Next.js 14 App Router, seamlessly rendering B2B marketing channels, animated Dashboards, and Interactive AI Chatbots simultaneously via Node.  
> ✅ **Backend (API + ML Engine):** Python FastAPI handling JWT Auth validation, heavy predictive algorithmic sorting, and rapid database queries.  
> ✅ **Database:** Connects cleanly to any robust PostgreSQL instance natively via SQLAlchemy ORMs.

---

## 🚀 Getting Started

To run the full infrastructure suite locally on your machine, both the Frontend and Backend servers must be booted in separate terminal windows.

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [Python (3.10+)](https://www.python.org/)
- *Optional: Active PostgreSQL server string in `.env` (defaults to auto-generated SQLite database `bloodbank.db` if omitted).*

### 1. Initialize API & AI Engine (Terminal 1)
```bash
cd backend
python -m venv venv
# On Windows use: .\venv\Scripts\activate
# On Mac/Linux use: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
> The API will now stream locally on `http://127.0.0.1:8000`.

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
HemoAI/
├── backend/                       # Python AI & REST API Core
│   ├── auth.py                    # JWT / Bcrypt Cryptography 
│   ├── database.py                # Postgres SQLAlchemy Initializer
│   ├── main.py                    # Core FastAPI Router logic
│   ├── ml_model.py                # Scikit-Learn Prediction Triage
│   ├── models.py                  # Database Schemas
│   └── schemas.py                 # Pydantic Typing Validation
│
└── frontend/                      # Next.js Application
    ├── public/                    # Static UI Assets
    └── src/
        ├── app/
        │   ├── (auth)/            # Split-Screen JWT Login/Signup 
        │   ├── (marketing)/       # B2B Patient/Hospital Overviews
        │   └── dashboard/         # Core Interactive Analytics Pane
        └── components/            # Global Navbars, Footers, and AiBots
```

---

## 📖 API Documentation

Because we leverage FastAPI, interactive OpenAPI documentation generates automatically. While the backend engine is running, simply navigate to:

- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Structure:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---
<div align="center">
<i>Surgically constructed for healthcare scalability.</i>
</div>
