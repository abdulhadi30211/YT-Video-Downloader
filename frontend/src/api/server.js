import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import { fetchVideoInfo, downloadVideo } from './yt-dlp-utils.js';
import { fetchUniversalVideoInfo, downloadUniversalVideoWithProgress } from './universal-dlp-utils.js';
import http from 'http';
import { Server } from 'socket.io';

// Helper function to format duration
function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
}

const app = express();
const port = process.env.PORT || 4000; // Use environment port for production or default to 4000

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || '*' : '*', // Allow frontend URL in production
  credentials: true
}));
app.use(express.json());

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));

  // Serve index.html for all other routes (for React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

// Endpoint to fetch video information
app.get('/api/info', async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid YouTube URL.' });
  }

  try {
    const videoInfo = await fetchVideoInfo(url);
    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for playlist info
app.get('/api/playlist-info', async (req, res) => {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid playlist ID.' });
  }

  try {
    // Use yt-dlp to get playlist info
    const ytDlpPath = process.env.YT_DLP_PATH || 'yt-dlp';
    const playlistUrl = `https://www.youtube.com/playlist?list=${id}`;
    
    const ytDlp = spawn(ytDlpPath, ['--dump-json', '--flat-playlist', playlistUrl]);
    
    let data = '';
    let errorData = '';

    ytDlp.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    ytDlp.stderr.on('data', (chunk) => {
      errorData += chunk.toString();
    });

    ytDlp.on('close', (code) => {
      if (code === 0) {
        try {
          // Check if the output starts with HTML (indicating an error page)
          if (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html')) {
            return res.status(500).json({ error: 'Received HTML response instead of JSON. The playlist URL might be invalid or private.' });
          }
          
          // Parse the output - it might contain multiple JSON objects (one for playlist info and one for each video)
          const lines = data.trim().split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            return res.status(500).json({ error: 'No data received from yt-dlp' });
          }
          
          // Check if the first item is playlist info or a video
          let playlistInfo = null;
          let videoStartIndex = 0;
          
          try {
            const firstItem = JSON.parse(lines[0]);
            // Check if it's playlist metadata by looking for playlist-specific properties
            // Different yt-dlp versions might return different formats
            if ((firstItem.title && firstItem.id && firstItem.entries) || 
                (firstItem.title && firstItem.id && firstItem._type === 'playlist')) {
              playlistInfo = firstItem;
              videoStartIndex = 1;
            } else {
              // Otherwise, the first item is a video
              // Use the provided playlist ID for the playlist info
              playlistInfo = { id: id, title: firstItem.playlist_title || '', description: '', thumbnail: '', uploader: firstItem.uploader || 'Unknown' };
              videoStartIndex = 0;
            }
          } catch (e) {
            return res.status(500).json({ error: 'Failed to parse playlist info' });
          }
          
          // Remaining lines are video info
          const videos = lines.slice(videoStartIndex)
            .filter(line => line.trim())
            .map(line => {
              try {
                const video = JSON.parse(line);
                return {
                  id: video.id,
                  title: video.title,
                  thumbnail: video.thumbnail ? video.thumbnail.replace('http://', 'https://') : `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
                  duration: video.duration ? formatDuration(video.duration) : 'N/A',
                  url: `https://www.youtube.com/watch?v=${video.id}`
                };
              } catch (e) {
                console.error('Error parsing video info:', e);
                return null;
              }
            })
            .filter(Boolean);
            
          const result = {
            id: playlistInfo.id,
            title: playlistInfo.title,
            description: playlistInfo.description || '',
            thumbnail: playlistInfo.thumbnail ? playlistInfo.thumbnail.replace('http://', 'https://') : `https://i.ytimg.com/vi/${playlistInfo.id}/mqdefault.jpg`,
            video_count: videos.length,
            uploader: playlistInfo.uploader || 'Unknown',
            videos: videos
          };
          
          res.json(result);
        } catch (e) {
          console.error('Error parsing playlist info:', e);
          res.status(500).json({ error: `Failed to parse playlist info: ${e.message}` });
        }
      } else {
        res.status(500).json({ error: `yt-dlp exited with code ${code}. Error: ${errorData || 'No stderr output.'}` });
      }
    });

    ytDlp.on('error', (err) => {
      if (err.code === 'ENOENT') {
        res.status(500).json({ error: 'yt-dlp command not found. Please ensure yt-dlp is installed and in your system PATH.' });
      } else {
        res.status(500).json({ error: `Failed to start yt-dlp process: ${err.message}` });
      }
    });
  } catch (error) {
    console.error('Error fetching playlist info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for universal video info
app.get('/api/universal-info', async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid video URL.' });
  }

  try {
    const videoInfo = await fetchUniversalVideoInfo(url);
    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching universal video info:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for universal video download
app.get('/api/universal-download', (req, res) => {
  let { url, formatId, filename, socketId } = req.query;
  
  // If no socketId provided, generate a unique one
  if (!socketId) {
    socketId = `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  console.log('Backend: Received universal download request with:', { url, formatId, filename, socketId });

  if (!url || typeof url !== 'string' || !formatId || typeof formatId !== 'string' || !filename || typeof filename !== 'string') {
    console.error('Backend: Missing or invalid universal download parameters.');
    return res.status(400).json({ error: 'Missing or invalid download parameters.' });
  }

  try {
    downloadUniversalVideoWithProgress(url, formatId, res, filename, io, socketId);
  } catch (error) {
    console.error('Backend: Error initiating universal download:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to download video/audio
app.get('/api/download', (req, res) => {
  let { url, formatId, filename, socketId } = req.query;
  
  // If no socketId provided, generate a unique one
  if (!socketId) {
    socketId = `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  console.log('Backend: Received download request with:', { url, formatId, filename, socketId });

  if (!url || typeof url !== 'string' || !formatId || typeof formatId !== 'string' || !filename || typeof filename !== 'string') {
    console.error('Backend: Missing or invalid download parameters.');
    return res.status(400).json({ error: 'Missing or invalid download parameters.' });
  }

  try {
    downloadVideoWithProgress(url, formatId, res, filename, socketId);
  } catch (error) {
    console.error('Backend: Error initiating download:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || '*' : '*', // Allow frontend URL in production
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  
  // Handle joining download room
  socket.on('joinDownloadRoom', (socketId) => {
    socket.join(socketId);
    console.log('Client joined download room:', socketId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

// Function to download video with progress updates
const downloadVideoWithProgress = (url, formatId, res, filename, socketId) => {
  const ytDlpArgs = ['-f', `${formatId}+bestaudio/best`, '--merge-output-format', 'mp4', '--no-cache-dir', '--no-part', '--no-mtime', '--newline', url, '-o', '-'];
  
  console.log('Server: Spawning yt-dlp for download with args:', ytDlpArgs.join(' '));
  const ytDlpPath = process.env.YT_DLP_PATH || 'yt-dlp';
  const ytDlp = spawn(ytDlpPath, ytDlpArgs);

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'video/mp4');

  ytDlp.stdout.pipe(res);

  ytDlp.stderr.on('data', (data) => {
    const dataStr = data.toString();
    
    // Look for progress information in stderr and send to client via WebSocket
    const progressMatch = dataStr.match(/\[download\].*?(\d+\.\d+)%/);
    const speedMatch = dataStr.match(/at\s+([\d.]+\s*[KMGT]?i?B\/s)/);
    const etaMatch = dataStr.match(/ETA\s+(\d+:\d+)/);
    
    if (progressMatch) {
      const progress = progressMatch[1];
      let progressInfo = { 
        progress: parseFloat(progress),
        url: url,
        formatId: formatId
      };
      
      if (speedMatch) {
        progressInfo.speed = speedMatch[1];
      }
      
      if (etaMatch) {
        progressInfo.eta = etaMatch[1];
      }
      
      // Emit progress update to the specific client
      if (socketId) {
        io.to(socketId).emit('downloadProgress', progressInfo);
      }
    }
  });

  ytDlp.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code} during download.`);
      if (!res.headersSent) {
        res.status(500).send(`Failed to download video. yt-dlp exited with code ${code}.`);
      }
      
      // Emit error to client if needed
      if (socketId) {
        io.to(socketId).emit('downloadError', { error: `yt-dlp exited with code ${code}` });
      }
    } else {
      console.log('Download stream finished successfully.');
      
      // Emit completion to client
      if (socketId) {
        io.to(socketId).emit('downloadComplete', { message: 'Download completed successfully' });
      }
    }
  });

  ytDlp.on('error', (err) => {
    console.error('Failed to start yt-dlp process for download:', err);
    if (!res.headersSent) {
      if (err.code === 'ENOENT') {
        res.status(500).send('Server error: yt-dlp command not found. Please ensure yt-dlp is installed and in your system PATH.');
      } else {
        res.status(500).send(`Server error during download: ${err.message}`);
      }
    }
    
    // Emit error to client
    if (socketId) {
      io.to(socketId).emit('downloadError', { error: err.message });
    }
  });
};

// Handle port in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use. Trying different port...`);
    
    // Try to find an available port
    const newServer = http.createServer(app);
    
    let newPort = port + 1;
    const tryPort = (portNum) => {
      if (portNum > 4010) { // Don't try too many ports
        console.error('Could not find an available port. Please close other applications.');
        return;
      }
      
      newServer.listen(portNum, 'localhost', () => {
        console.log(`Backend server listening at http://localhost:${portNum}`);
      }).on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
          console.log(`Port ${portNum} is also in use. Trying ${portNum + 1}...`);
          tryPort(portNum + 1);
        }
      });
    };
    
    tryPort(newPort);
  }
});