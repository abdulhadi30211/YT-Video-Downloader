import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import { fetchVideoInfo, downloadVideo } from './yt-dlp-utils';
import { fetchUniversalVideoInfo, downloadUniversalVideo } from './universal-dlp-utils';

// Helper function to format duration
function formatDuration(seconds: number): string {
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
const port = parseInt(process.env.PORT || '4000', 10); // Use environment variable or default to 4000

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Use environment variable for CORS in production
}));
app.use(express.json());

// Endpoint to fetch video information
app.get('/api/info', async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid YouTube URL.' });
  }

  try {
    const videoInfo = await fetchVideoInfo(url);
    res.json(videoInfo);
  } catch (error: any) {
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
    const ytDlpPath = path.join(__dirname, '../../yt-dlp.exe');
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
          
          // First line should be playlist info
          const playlistInfo = JSON.parse(lines[0]);
          
          // Remaining lines are video info
          const videos = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              try {
                const video = JSON.parse(line);
                return {
                  id: video.id,
                  title: video.title,
                  thumbnail: video.thumbnail,
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
            thumbnail: playlistInfo.thumbnail || '',
            video_count: videos.length,
            uploader: playlistInfo.uploader || 'Unknown',
            videos: videos
          };
          
          res.json(result);
        } catch (e: any) {
          console.error('Error parsing playlist info:', e);
          res.status(500).json({ error: `Failed to parse playlist info: ${e.message}` });
        }
      } else {
        res.status(500).json({ error: `yt-dlp exited with code ${code}. Error: ${errorData || 'No stderr output.'}` });
      }
    });

    ytDlp.on('error', (err: any) => {
      if (err.code === 'ENOENT') {
        res.status(500).json({ error: 'yt-dlp command not found. Please ensure yt-dlp is installed and in your system PATH.' });
      } else {
        res.status(500).json({ error: `Failed to start yt-dlp process: ${err.message}` });
      }
    });
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Error fetching universal video info:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to download video/audio
// Endpoint for universal video download
app.get('/api/universal-download', (req, res) => {
  const { url, formatId, filename } = req.query;

  console.log('Backend: Received universal download request with:', { url, formatId, filename });

  if (!url || typeof url !== 'string' || !formatId || typeof formatId !== 'string' || !filename || typeof filename !== 'string') {
    console.error('Backend: Missing or invalid universal download parameters.');
    return res.status(400).json({ error: 'Missing or invalid download parameters.' });
  }

  try {
    downloadUniversalVideo(url, formatId, res, filename);
  } catch (error: any) {
    console.error('Backend: Error initiating universal download:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to download video/audio
app.get('/api/download', (req, res) => {
  const { url, formatId, filename } = req.query;

  console.log('Backend: Received download request with:', { url, formatId, filename });

  if (!url || typeof url !== 'string' || !formatId || typeof formatId !== 'string' || !filename || typeof filename !== 'string') {
    console.error('Backend: Missing or invalid download parameters.');
    return res.status(400).json({ error: 'Missing or invalid download parameters.' });
  }

  try {
    downloadVideo(url, formatId, res, filename);
  } catch (error: any) {
    console.error('Backend: Error initiating download:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

// Handle port in use error
server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use. Trying different port...`);
    
    // Try to find an available port
    const http = require('http');
    const newServer = http.createServer(app);
    
    let newPort = port + 1;
    const tryPort = (portNum: number) => {
      if (portNum > 4010) { // Don't try too many ports
        console.error('Could not find an available port. Please close other applications.');
        return;
      }
      
      newServer.listen(portNum, 'localhost', () => {
        console.log(`Backend server listening at http://localhost:${portNum}`);
      }).on('error', (e: any) => {
        if (e.code === 'EADDRINUSE') {
          console.log(`Port ${portNum} is also in use. Trying ${portNum + 1}...`);
          tryPort(portNum + 1);
        }
      });
    };
    
    tryPort(newPort);
  }
});

