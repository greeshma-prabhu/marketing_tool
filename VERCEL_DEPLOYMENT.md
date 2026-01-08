# Vercel Deployment Guide

This guide will help you deploy your Onepager Generator application to Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Backend Hosting** - Your FastAPI backend needs to be hosted separately (see options below)

---

## 🚀 Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# If not already done, initialize git and push to GitHub
cd /opt/Marketing_tool
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 1.2 Create `.gitignore` (if not exists)

Create `/opt/Marketing_tool/.gitignore`:

```
# Dependencies
node_modules/
venv/
__pycache__/
*.pyc

# Environment variables
.env
.env.local
.env.production

# Build outputs
.next/
out/
dist/
build/

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## 🔧 Step 2: Configure Vercel for Next.js Frontend

### 2.1 Create `vercel.json` Configuration

Create `/opt/Marketing_tool/frontend/vercel.json`:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR_BACKEND_URL/api/:path*"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://YOUR_BACKEND_URL"
  }
}
```

### 2.2 Update Environment Variables

Update `/opt/Marketing_tool/frontend/.env.local` (create if not exists):

```env
# Backend API URL (will be set in Vercel dashboard)
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL

# PosterMyWall API Key (optional)
NEXT_PUBLIC_POSTERMYWALL_API_KEY=your_postermywall_api_key
```

### 2.3 Update API Calls in Frontend

Make sure all API calls use the environment variable:

Check `frontend/src/services/postermywall.ts` and update:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

---

## 🌐 Step 3: Deploy Backend (Choose One Option)

### Option A: Railway (Recommended - Easy)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add these environment variables:
   - `POSTERMYWALL_API_KEY` (if you have one)
6. Railway will auto-detect Python and install dependencies
7. Set start command: `cd api && uvicorn main:app --host 0.0.0.0 --port $PORT`
8. Copy the generated URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Name**: `onepager-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd api && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Deploy and copy the URL

### Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create app: `fly launch` (in your project root)
4. Create `fly.toml`:
```toml
app = "your-app-name"
primary_region = "iad"

[build]

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[services]]
  http_checks = []
  internal_port = 8000
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
```

5. Deploy: `fly deploy`

---

## 📦 Step 4: Deploy Frontend to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**
   - Select your repository
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install` (or leave default)

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_API_URL = https://YOUR_BACKEND_URL
   NEXT_PUBLIC_POSTERMYWALL_API_KEY = your_api_key_here
   ```

6. **Update `vercel.json` Rewrites:**
   Replace `YOUR_BACKEND_URL` with your actual backend URL

7. **Click "Deploy"**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? onepager-generator
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

---

## 🔄 Step 5: Update Frontend API URLs

Update all API calls to use the environment variable:

### Update `frontend/src/services/postermywall.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

### Update all fetch calls:

Find and replace in your frontend code:
- `http://localhost:8000` → `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}`

Or create a config file `frontend/src/config/api.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

Then use `API_BASE_URL` everywhere.

---

## ✅ Step 6: Verify Deployment

1. **Check Frontend**: Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. **Check Backend**: Visit `https://YOUR_BACKEND_URL/docs` (FastAPI docs)
3. **Test API Connection**: Open browser console and check for API errors
4. **Test Template Loading**: Try selecting a template
5. **Test Generation**: Try generating an onepager

---

## 🐛 Troubleshooting

### Issue: API calls failing (CORS errors)

**Solution**: Update backend CORS settings in `api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "http://localhost:3000",  # For local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Environment variables not working

**Solution**: 
- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables
- Check Vercel dashboard → Settings → Environment Variables

### Issue: Build fails

**Solution**:
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct scripts
- Check Node.js version (Vercel auto-detects, but you can set in `package.json`)

### Issue: Backend not accessible

**Solution**:
- Check backend is running and accessible
- Verify CORS settings allow Vercel domain
- Check backend logs for errors

---

## 📝 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed (Railway/Render/Fly.io)
- [ ] Backend URL copied
- [ ] `vercel.json` created with correct backend URL
- [ ] Environment variables set in Vercel
- [ ] Frontend API calls use environment variables
- [ ] CORS configured on backend
- [ ] Frontend deployed to Vercel
- [ ] Tested end-to-end

---

## 🎉 You're Done!

Your app should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app` (or your chosen service)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)



