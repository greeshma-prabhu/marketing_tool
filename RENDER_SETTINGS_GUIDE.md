# 📝 Step-by-Step: Update Render Settings

## 🎯 Goal
Update your Render service to use the root `package.json` so it can find and build your app correctly.

## 📋 Step-by-Step Instructions

### Step 1: Go to Your Service
1. Open [Render Dashboard](https://dashboard.render.com)
2. Click on your service: **"marketing_tool-1.1"** (or whatever you named it)
3. You should see the service overview page

### Step 2: Open Settings
1. Look at the **left sidebar**
2. Click on **"Settings"** (it's in the main navigation, not under a submenu)
3. You'll see all the service configuration options

### Step 3: Update Build & Start Commands
Scroll down to find these sections:

#### **Build Command**
1. Find the field labeled **"Build Command"**
2. **Delete** the current value: `npm install && npm run build`
3. **Enter** this new value:
   ```
   npm run build
   ```

#### **Start Command**
1. Find the field labeled **"Start Command"**
2. **Delete** the current value: `cd frontend && npm start` (or whatever is there)
3. **Enter** this new value:
   ```
   npm start
   ```

### Step 4: Check Root Directory
1. Look for **"Root Directory"** field
2. Make sure it's **EMPTY** (or set to `/` or `.`)
3. If it says `frontend`, **clear it** or set it to empty

### Step 5: Save Changes
1. Scroll to the **bottom** of the settings page
2. Click the **"Save Changes"** button (usually blue/green)
3. Render will automatically trigger a new deployment

### Step 6: Monitor Deployment
1. After saving, you'll be redirected to the **"Events"** or **"Logs"** page
2. Watch the build logs
3. You should see:
   - ✅ `npm run build` executing
   - ✅ `cd frontend && npm install` running
   - ✅ Build completing successfully
   - ✅ Server starting with `npm start`

## 🎨 Visual Guide (What You'll See)

### Settings Page Layout:
```
┌─────────────────────────────────────┐
│ Settings                            │
├─────────────────────────────────────┤
│                                     │
│ Name: marketing_tool-1.1           │
│                                     │
│ Environment: Node                  │
│                                     │
│ Build Command: [npm run build]     │ ← Update this
│                                     │
│ Start Command: [npm start]          │ ← Update this
│                                     │
│ Root Directory: [empty]             │ ← Make sure empty
│                                     │
│ [Save Changes]                      │ ← Click this
└─────────────────────────────────────┘
```

## ✅ Verification Checklist

After updating, check these in the build logs:

- [ ] Build command shows: `npm run build`
- [ ] Logs show: `cd frontend && npm install`
- [ ] Logs show: `cd frontend && npm run build`
- [ ] Build completes without "package.json not found" error
- [ ] Start command shows: `npm start`
- [ ] Server logs show: `Server ready on http://0.0.0.0:XXXX`

## 🐛 If You Can't Find Settings

1. **Check you're on the right page:**
   - URL should be: `dashboard.render.com/web/[service-id]/settings`
   - Left sidebar should show "Settings" highlighted

2. **Alternative path:**
   - Click on your service name
   - Look for "Settings" in the left sidebar
   - Click it

3. **If still stuck:**
   - Try clicking "Environment" in the sidebar first
   - Then look for "Settings" tab at the top

## 📸 Quick Reference

**Current (Wrong) Settings:**
- Build Command: `npm install && npm run build` ❌
- Start Command: `cd frontend && npm start` ❌

**New (Correct) Settings:**
- Build Command: `npm run build` ✅
- Start Command: `npm start` ✅
- Root Directory: (empty) ✅

## 🚀 After Saving

1. Render will **automatically start a new deployment**
2. Watch the **build logs** in real-time
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your app should be live! 🎉

---

**Need Help?** If you get stuck, check the build logs for specific error messages and share them!

