# Railway Deployment Guide

## Configuration Summary

Your backend is now configured for Railway deployment with the following settings:

### Railway Dashboard Settings

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

**Port:** `8080`

### Environment Variables

Add these in Railway dashboard under your service → Variables:

```bash
PORT=8080
CORS_ORIGIN=*
```

Or if you have a specific frontend domain:
```bash
CORS_ORIGIN=https://your-frontend-domain.com
```

## What Was Changed

### 1. **Cross-platform yt-dlp Support**
Updated all files to work on both Windows and Linux:
- `src/api/yt-dlp-utils.ts`
- `src/api/universal-dlp-utils.ts`
- `src/api/server.ts`

The code now:
- Uses `yt-dlp.exe` on Windows (local development)
- Uses `yt-dlp` command on Linux (Railway production)

### 2. **Automatic yt-dlp Installation**
Added `postinstall` script to `package.json` that:
- Detects if running on Linux
- Installs Python pip if needed
- Installs yt-dlp via pip

### 3. **Build Script**
Added TypeScript compilation step before starting the server.

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Railway deployment"
   git push origin main
   ```

2. **Connect Railway to GitHub**
   - Go to Railway dashboard
   - Create new project → Deploy from GitHub repo
   - Select your repository: `abdulhadi30211/YT-Video-Downloader`
   - Select the `backend` folder as root directory (optional)

3. **Configure Environment Variables**
   - In Railway dashboard, go to your service
   - Click "Variables" tab
   - Add `PORT=8080` and `CORS_ORIGIN=*`

4. **Deploy**
   - Railway will automatically build and deploy
   - First deployment may take 2-3 minutes (yt-dlp installation)

## Troubleshooting

### Port Issues
If port 8080 doesn't work, Railway will automatically use the PORT environment variable. The server already listens on the correct port.

### yt-dlp Not Found
Check deployment logs for postinstall script output. If it fails:
- The app should still work as yt-dlp is called as a system command
- Railway's Node image should have Python available

### CORS Errors
If your frontend can't connect:
- Set `CORS_ORIGIN` to your frontend's URL
- Or use `*` for development (allows all origins)

### Build Fails
Check logs for TypeScript errors. Common issues:
- Missing type definitions
- Syntax errors in `.ts` files

## Testing Locally (Linux-like environment)

To test the Linux build locally:

```bash
# Install dependencies
npm install

# This will run postinstall script
# On Windows, it will skip yt-dlp installation

# Build TypeScript
npm run build

# Start server
npm start
```

Server will start at `http://localhost:4000` (or PORT if set).

## API Endpoints

Once deployed, your API will be available at:

```
https://yt-video-downloader-production-79eb.up.railway.app

GET /api/info?url=<youtube_url>
GET /api/playlist-info?id=<playlist_id>
GET /api/universal-info?url=<video_url>
GET /api/download?url=<url>&formatId=<id>&filename=<name>
GET /api/universal-download?url=<url>&formatId=<id>&filename=<name>
```

## Next Steps

1. Update your frontend API URL to point to Railway domain
2. Test all endpoints
3. Monitor logs in Railway dashboard
4. Set up custom domain if needed
