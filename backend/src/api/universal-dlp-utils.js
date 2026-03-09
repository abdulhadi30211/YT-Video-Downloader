import { spawn } from 'child_process';
import * as path from 'path';
import * as os from 'os';

/**
 * Fetches video information from any website using yt-dlp.
 * @param {string} url The video URL from any website.
 * @returns {Promise<Object>} A promise that resolves with VideoInfo or rejects with an error.
 */
export const fetchUniversalVideoInfo = (url) => {
  return new Promise((resolve, reject) => {
    console.log('universal-dlp-utils: Attempting to fetch video info for URL:', url);
    const ytDlpPath = process.env.YT_DLP_PATH || 'yt-dlp';
    // Get comprehensive format information with best quality options
    const ytDlp = spawn(ytDlpPath, ['--dump-json', '--list-formats', url]);
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
          // Parse the output - it might contain multiple JSON objects
          const lines = data.trim().split('\n');
          let info = null;
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsed = JSON.parse(line);
                if (parsed.formats || parsed.format_id) {
                  info = parsed;
                  break;
                }
              } catch (e) {
                // Skip lines that aren't valid JSON
                continue;
              }
            }
          }
          
          if (!info) {
            reject(new Error('Could not parse video info from yt-dlp output'));
            return;
          }
          
          const videoInfo = {
            id: info.id,
            title: info.title,
            thumbnail: info.thumbnail ? info.thumbnail.replace('http://', 'https://') : '',
            duration_string: info.duration_string,
            formats: info.formats ? info.formats.map((f) => ({
              format_id: f.format_id,
              ext: f.ext,
              resolution: f.resolution || `${f.width}x${f.height}` || 'unknown',
              vcodec: f.vcodec,
              acodec: f.acodec,
              filesize: f.filesize,
              filesize_approx: f.filesize_approx,
              url: f.url,
            })).filter(f => f.filesize || f.filesize_approx) : [{
              format_id: info.format_id || 'unknown',
              ext: info.ext || 'mp4',
              resolution: info.resolution || `${info.width}x${info.height}` || 'unknown',
              vcodec: info.vcodec || 'unknown',
              acodec: info.acodec || 'unknown',
              filesize: info.filesize,
              filesize_approx: info.filesize_approx,
              url: info.url,
            }],
          };
          resolve(videoInfo);
        } catch (e) {
          reject(new Error(`Failed to parse yt-dlp output: ${e.message}. Raw output: ${data}`));
        }
      } else {
        reject(new Error(`yt-dlp exited with code ${code}. Error: ${errorData || 'No stderr output.'}`));
      }
    });

    ytDlp.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(new Error('yt-dlp command not found. Please ensure yt-dlp is installed and in your system PATH.'));
      } else {
        reject(new Error(`Failed to start yt-dlp process: ${err.message}`));
      }
    });
  });
};

/**
 * Streams a video download from any website using yt-dlp.
 * @param {string} url The video URL from any website.
 * @param {string} formatId The format ID to download.
 * @param {Object} res The Express response object to stream the file to.
 * @param {string} filename The desired filename for the download.
 */
export const downloadUniversalVideo = (url, formatId, res, filename) => {
  // For backward compatibility, call the progress version with null values
  downloadUniversalVideoWithProgress(url, formatId, res, filename, null, null);
};

export const downloadUniversalVideoWithProgress = (url, formatId, res, filename, io, socketId) => {
  // Use yt-dlp to download with proper format selection for any website
  const ytDlpArgs = ['-f', `${formatId}+bestaudio/best`, '--merge-output-format', 'mp4', '--no-cache-dir', '--no-part', '--no-mtime', url, '-o', '-', '--newline'];
  
  console.log('universal-dlp-utils: Spawning yt-dlp for download with args:', ytDlpArgs.join(' '));
  const ytDlpPath = process.env.YT_DLP_PATH || 'yt-dlp';
  const ytDlp = spawn(ytDlpPath, ytDlpArgs);

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'video/mp4'); // Set to video/mp4 for video downloads

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
      if (socketId && io) {
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
    } else {
      console.log('Download stream finished successfully.');
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
  });
};