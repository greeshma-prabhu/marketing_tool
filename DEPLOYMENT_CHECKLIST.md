# Deployment Checklist for Render

## ✅ Pre-Deployment Checklist

### 1. Code Configuration
- [x] Custom server.js created in `frontend/` directory
- [x] Package.json start script updated to use server.js
- [x] Server binds to `0.0.0.0` (not localhost)
- [x] Server uses `PORT` environment variable
- [x] API configuration uses environment variables

### 2. Build Configuration
- [x] Next.js build command: `cd frontend && npm run build`
- [x] Start command: `cd frontend && npm start`
- [x] Node version: 18+ or 20+ (specify in package.json if needed)

### 3. Environment Variables
Set these in Render dashboard:
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (or let Render set automatically)
- [ ] `NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com`

### 4. Render Settings
- [ ] **Root Directory**: Leave empty (or `frontend` if deploying only frontend)
- [ ] **Build Command**: `cd frontend && npm install && npm run build`
- [ ] **Start Command**: `cd frontend && npm start`
- [ ] **Health Check Path**: `/`
- [ ] **Auto-Deploy**: Enable if desired

## 🚀 Deployment Steps

1. **Push code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Configure for Render deployment"
   git push
   ```

2. **Create Web Service in Render**
   - Go to Render Dashboard
   - New + → Web Service
   - Connect repository

3. **Configure Settings**
   - Use settings from checklist above
   - Add environment variables
   - Set health check path

4. **Deploy**
   - Click "Create Web Service"
   - Monitor build logs
   - Wait for deployment to complete

5. **Verify**
   - Visit your app URL
   - Check health check endpoint
   - Test all features

## 🐛 Troubleshooting

### Port Scan Timeout
**Solution**: Ensure `server.js` exists and `npm start` runs it

### Build Fails
**Check**:
- Node version compatibility
- All dependencies in package.json
- Build logs for specific errors

### App Doesn't Start
**Check**:
- Server logs in Render dashboard
- PORT environment variable is set
- server.js is in correct location

## 📝 Quick Reference

**Build Command**: `cd frontend && npm install && npm run build`
**Start Command**: `cd frontend && npm start`
**Health Check**: `/`
**Port**: Set automatically by Render (defaults to 10000)

---

**Status**: ✅ Ready for Render deployment

