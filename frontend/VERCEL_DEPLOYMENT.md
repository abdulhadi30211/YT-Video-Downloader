# Vercel Frontend Deployment Guide

## ✅ Environment Variables for Vercel

Add this **single environment variable** in your Vercel dashboard:

### **Required:**
```bash
VITE_BACKEND_URL=https://yt-demo-backend-production.up.railway.app
```

---

## 📋 Step-by-Step Deployment Instructions

### **1. Push Changes to GitHub**
```bash
git add .
git commit -m "Configure frontend for Vercel deployment with environment variables"
git push origin main
```

### **2. Deploy to Vercel**

#### Option A: Import from GitHub
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your repository: `YT-Video-Downloader`
5. Set **Root Directory** to `frontend` (important!)
6. Click **"Deploy"**

#### Option B: Using Vercel CLI
```bash
cd frontend
npm install-g vercel
vercel login
vercel --prod
```

### **3. Configure Environment Variables in Vercel**

After creating your project:
1. Go to your project settings
2. Navigate to **"Environment Variables"**
3. Add the following variable:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://yt-demo-backend-production.up.railway.app`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
4. Click **"Save"**

### **4. Redeploy**
After adding environment variables, trigger a redeploy:
- Go to **"Deployments"** tab
- Click on the latest deployment
- Click **"Redeploy"**

---

## 🔧 Railway Backend Configuration

Make sure your Railway backend allows CORS from Vercel:

### In Railway Dashboard → Variables:
```bash
PORT=8080
CORS_ORIGIN=*
```

Or for better security, use your Vercel domain:
```bash
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🌐 URLs After Deployment

Once deployed, your app will be available at:

- **Frontend (Vercel):** `https://your-app-name.vercel.app`
- **Backend (Railway):** `https://yt-demo-backend-production.up.railway.app`

### API Endpoints:
```
GET https://yt-demo-backend-production.up.railway.app/api/info?url=<youtube_url>
GET https://yt-demo-backend-production.up.railway.app/api/playlist-info?id=<playlist_id>
GET https://yt-demo-backend-production.up.railway.app/api/universal-info?url=<video_url>
GET https://yt-demo-backend-production.up.railway.app/api/download?url=<url>&formatId=<id>&filename=<name>
GET https://yt-demo-backend-production.up.railway.app/api/universal-download?url=<url>&formatId=<id>&filename=<name>
```

---

## ✨ What Was Fixed

1. **Socket.IO Connection**: Updated to use `VITE_BACKEND_URL` environment variable
2. **Cross-Origin Requests**: All API calls will now use the Railway backend URL
3. **WebSocket Support**: Socket.IO connections will work over HTTPS/WSS

---

## 🧪 Testing Locally with Environment Variables

To test with production environment variables locally:

### Create `.env.local` in frontend directory:
```bash
VITE_BACKEND_URL=https://yt-video-downloader-production-79eb.up.railway.app
```

Then restart your dev server:
```bash
npm run dev
```

---

## ⚠️ Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Make sure Railway backend has correct CORS settings:
```bash
CORS_ORIGIN=https://your-app.vercel.app
# or use * for development
CORS_ORIGIN=*
```

### Issue: WebSocket Connection Fails
**Solution:** Railway supports WebSockets. Make sure you're using HTTPS URL.

### Issue: API 404 Errors
**Solution:** Verify that:
- Backend is deployed and running on Railway
- `VITE_BACKEND_URL` is set correctly in Vercel
- No trailing slash in the URL

### Issue: Build Fails
**Solution:** Check that:
- Root directory is set to `frontend`
- All dependencies are installed
- TypeScript compiles without errors

---

## 🎯 Final Checklist

- ✅ Pushed code changes to GitHub
- ✅ Created Vercel project with `frontend` as root directory
- ✅ Added `VITE_BACKEND_URL` environment variable
- ✅ Configured Railway CORS settings
- ✅ Both services are deployed and running
- ✅ Tested video download functionality

---

## 📊 Monitoring

### Vercel:
- View deployment logs in Vercel dashboard
- Check function logs under **"Functions"** tab

### Railway:
- View real-time logs in Railway dashboard
- Monitor resource usage (CPU/Memory)

---

Your app is now fully deployed with:
- **Frontend:** Vercel (Global CDN)
- **Backend:** Railway (Cloud hosting with yt-dlp support)

🎉 Happy downloading!
