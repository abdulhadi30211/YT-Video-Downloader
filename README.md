# Tublyx - Free Video Downloader

Tublyx is a powerful, user-friendly video downloader that supports multiple platforms including YouTube, Facebook, Instagram, TikTok, and 1000+ other platforms. Built with React, TypeScript, and Vite, it provides a seamless video downloading experience with real-time progress tracking.

## Features

- **Multi-platform Support**: Download videos from YouTube, Facebook, Instagram, TikTok, and 1000+ other platforms
- **Real-time Progress Tracking**: See download progress, speed, and estimated time remaining
- **Playlist Download**: Download entire YouTube playlists with individual video selection
- **Multiple Quality Options**: Choose from various video and audio quality formats
- **Professional UI/UX**: Clean, modern interface with intuitive navigation
- **Ad Integration**: Smart ad system that respects user experience
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **UI Components**: shadcn/ui
- **Video Processing**: yt-dlp (included in backend)
- **Real-time Updates**: Socket.io
- **Build Tool**: Vite

## Project Structure

```
yt-demo-download-2/
├── frontend/            # Frontend React application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── vite.config.ts # Vite configuration
│
├── backend/           # Backend server (Express + yt-dlp)
│   ├── src/api/      # Backend API code
│   ├── yt-dlp.exe    # Video extraction tool (Windows)
│   ├── package.json  # Backend dependencies
│   └── tsconfig.json # TypeScript config
│
└── package.json       # Root workspace config
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd yt-demo-download-2
```

2. Install all dependencies (frontend, backend, and root):
```bash
npm run install:all
```

This single command will install:
- Root workspace dependencies
- Frontend dependencies
- Backend dependencies

3. Start the development servers:
```bash
npm run dev
```

This will start both:
- **Frontend** on `http://localhost:8080`
- **Backend** on `http://localhost:4000`

The application will automatically open in your browser.

### Manual Installation

If you prefer to install dependencies separately:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Return to root and start dev servers
cd ..
npm run dev
```

## Development Commands

```bash
# Run both frontend and backend in development
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Build frontend for production
npm run build

# Lint frontend code
npm run lint

# Preview production build
npm run preview

# Start backend in production mode
npm start
```

## Production Deployment

### Building for Production

1. Build the frontend:
```bash
npm run build
```

The built files will be in `frontend/dist/`.

2. The backend is ready to run as-is with the compiled JavaScript files.

### Deploy to Railway

1. Create a Railway account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set the build command: `cd frontend && npm run build`
4. Set the start command: `cd backend && npm start`
5. Deploy the project

### Docker Deployment

The application can be containerized. Make sure to include the `backend/yt-dlp.exe` file in your Docker image.

## How It Works

### Frontend
- React SPA with Vite for fast development
- Proxies `/api` and `/socket.io` requests to backend (port 4000)
- Real-time download progress via Socket.IO
- Modern UI with shadcn/ui components

### Backend
- Express.js server handling all API requests
- Uses yt-dlp to extract and download videos
- Supports 1000+ platforms through yt-dlp
- WebSocket support for real-time progress updates

## API Endpoints

- `GET /api/info`: Fetch YouTube video information
- `GET /api/playlist-info`: Fetch YouTube playlist information  
- `GET /api/universal-info`: Fetch video information from any supported platform
- `GET /api/download`: Download YouTube video
- `GET /api/universal-download`: Download video from any supported platform

## Important Notes

1. **yt-dlp**: The backend includes `yt-dlp.exe` for Windows. For other platforms, download yt-dlp and place it in the backend folder.

2. **Port Configuration**: 
   - Frontend runs on port 8080
   - Backend runs on port 4000
   - These can be changed in `frontend/vite.config.ts` and `backend/src/api/server.ts`

3. **CORS**: The backend is configured to accept requests from any origin (development). For production, update CORS settings in `backend/src/api/server.ts`.

## Troubleshooting

### Port Already in Use
If port 4000 or 8080 is already in use, the servers will automatically try alternative ports.

### yt-dlp Not Found
Ensure `backend/yt-dlp.exe` exists and has execute permissions.

### Installation Issues
Try clearing npm cache:
```bash
npm cache clean --force
npm run install:all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Owner & Developer

**Abdulhadi** - Web Developer & Owner

[Portfolio](https://portfolio-abdulhadi1.vercel.app/)

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the developer through the portfolio website.

---

Tublyx - Free Video Downloader for 1000+ Platforms. Fast, secure, and completely free.