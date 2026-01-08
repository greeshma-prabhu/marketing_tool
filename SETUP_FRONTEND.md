# Setup Guide - FastAPI + React

## Prerequisites

- Python 3.11+
- Node.js 18+
- Gemini API key

## Installation

### Backend Setup
```bash
cd /opt/Marketing_tool
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd /opt/Marketing_tool/frontend
npm install
```

## Configuration

Create `.env` file in project root:
```bash
GOOGLE_API_KEY=your-gemini-api-key-here
LLM_PROVIDER=gemini
```

## Running

### Start Backend
```bash
cd /opt/Marketing_tool
source venv/bin/activate
./api/run_api.sh
```
Backend: http://localhost:8000 | Docs: http://localhost:8000/docs

### Start Frontend
```bash
cd /opt/Marketing_tool/frontend
npm run dev
```
Frontend: http://localhost:3000

## API Endpoints

- `GET /health` - Health check
- `POST /api/generate/from-csv` - Generate from CSV upload
- `POST /api/generate/from-json` - Generate from JSON input
- `GET /api/download/{filename}` - Download PDF
- `GET /api/templates` - List templates

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti :8000 | xargs kill -9

# Kill process on port 3000
lsof -ti :3000 | xargs kill -9
```

**Module not found:**
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules
npm install
```

**API connection error:**
- Check backend is running: `curl http://localhost:8000/health`
- Check CORS settings in `api/main.py`
- Verify API key in `.env`

---

**Ready!** Start both servers and open http://localhost:3000
