# Onepager Generation Agent

AI-powered system for automated onepager/brochure generation.

## 🚀 Quick Start

### 1. Backend (FastAPI)
```bash
cd /opt/Marketing_tool
source venv/bin/activate
./api/run_api.sh
```
Backend: http://localhost:8000 | API Docs: http://localhost:8000/docs

### 2. Frontend (React/Next.js)

**Option 1: Using the helper script (from root directory)**
```bash
cd /opt/Marketing_tool
./start_frontend.sh
```

**Option 2: Manual (from frontend directory)**
```bash
cd /opt/Marketing_tool/frontend
npm install  # First time only
npm run dev
```

Frontend: http://localhost:3000

## 📋 Features

- CSV upload or manual input
- AI-powered copy generation (Gemini 2.5 Pro)
- Professional PDF output (A4, print-ready)
- Quality control checks
- Modern web UI

## 🛠️ Tech Stack

- **Backend**: Python 3.11+, FastAPI
- **Frontend**: React, Next.js, Tailwind CSS
- **AI**: Google Gemini 2.5 Pro
- **PDF**: WeasyPrint

## 📁 Project Structure

```
marketing_tool/
├── api/              # FastAPI backend
├── core/             # Core processing logic
├── models/           # Data models
├── templates/        # HTML/CSS templates
├── frontend/         # React/Next.js frontend
├── scripts/          # CLI tools
└── data/             # Input/output data
```

## ⚙️ Configuration

Create `.env` file:
```bash
GOOGLE_API_KEY=your-gemini-api-key-here
LLM_PROVIDER=gemini
```

## 📚 Documentation

- **SETUP_FRONTEND.md** - Detailed setup guide for FastAPI + React

## 🎯 Usage

1. Start backend and frontend (see Quick Start)
2. Open http://localhost:3000
3. Upload CSV or fill manual form
4. Generate and download PDF

---

**Status**: MVP Complete ✅
