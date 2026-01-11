# Render Deployment Guide

This guide will help you deploy the Onepager Generator app to Render.

## 🚀 Quick Deploy to Render

### Option 1: Using Render Dashboard (Recommended)

1. **Create a New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Name**: `onepager-generator` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Root Directory**: Leave empty (or set to `frontend` if deploying only frontend)

3. **Environment Variables**
   Add these in the Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.onrender.com
   ```

4. **Advanced Settings**
   - **Health Check Path**: `/`
   - **Auto-Deploy**: `Yes` (if you want automatic deployments)

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app

### Option 2: Using render.yaml

1. Push the `render.yaml` file to your repository
2. In Render dashboard, select "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use `render.yaml`

## 🔧 Configuration Details

### Port Configuration

The app is configured to:
- Listen on the `PORT` environment variable (Render sets this automatically)
- Bind to `0.0.0.0` (required for Render)
- Default to port 3000 if PORT is not set (for local development)

### Custom Server

The `server.js` file ensures:
- Proper port binding for Render
- Host binding to `0.0.0.0` (not just localhost)
- Error handling for production

### Build Process

1. **Install Dependencies**: `npm install` in the frontend directory
2. **Build Next.js**: `npm run build` creates optimized production build
3. **Start Server**: `npm start` runs the custom server

## 📝 Environment Variables

### Required Variables

- `NODE_ENV`: Set to `production`
- `PORT`: Automatically set by Render (defaults to 10000)
- `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL

### Optional Variables

- `NEXT_PUBLIC_APP_URL`: Your frontend URL (for CORS, etc.)

## 🐛 Troubleshooting

### Port Scan Timeout Error

If you see "Port scan timeout reached":
1. ✅ Ensure `server.js` exists in `frontend/` directory
2. ✅ Check that `startCommand` uses `npm start` (which runs `server.js`)
3. ✅ Verify `PORT` environment variable is set
4. ✅ Check build logs for any errors

### Build Fails

1. Check Node.js version (should be 18+ or 20+)
2. Ensure all dependencies are in `package.json`
3. Check build logs for specific errors
4. Try building locally: `cd frontend && npm run build`

### App Doesn't Start

1. Check server logs in Render dashboard
2. Verify `server.js` is in the correct location
3. Ensure `PORT` env variable is set
4. Check that build completed successfully

## 🔄 Updating Your App

Render automatically redeploys when you push to your main branch (if auto-deploy is enabled).

To manually redeploy:
1. Go to your service in Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

## 📦 Alternative: Deploy Frontend Only

If you only want to deploy the frontend:

1. Set **Root Directory** to `frontend` in Render settings
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`

## 🌐 Custom Domain

To add a custom domain:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Follow DNS configuration instructions

## ✅ Verification

After deployment, verify:
1. ✅ Health check passes (visit `/`)
2. ✅ App loads without errors
3. ✅ API calls work (check browser console)
4. ✅ All routes are accessible

---

**Need Help?** Check Render's [documentation](https://render.com/docs) or open an issue.

