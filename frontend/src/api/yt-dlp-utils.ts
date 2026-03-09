import { spawn } from 'child_process';
import { Response } from 'express';
import * as path from 'path';
import * as os from 'os';

export interface VideoFormat {
  format_id: string;
  ext: string;
  resolution: string;
  vcodec: string;
  acodec: string;
  filesize?: number;
  filesize_approx?: number;
  url?: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration_string: string;
  formats: VideoFormat[];
}

/**
 * Fetches video information using yt-dlp.
 * @param url The YouTube video URL.
 * @returns A promise that resolves with VideoInfo or rejects with an error.
 */
export const fetchVideoInfo = (url: string): Promise<VideoInfo> => {
  return new Promise((resolve, reject) => {
    console.log('yt-dlp-utils: Attempting to fetch video info for URL:', url);
    const ytDlpPath = path.join(os.homedir(), 'Downloads', 'yt-dlp.exe');
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
          
          const videoInfo: VideoInfo = {
            id: info.id,
            title: info.title,
            thumbnail: info.thumbnail,
            duration_string: info.duration_string,
            formats: info.formats ? info.formats.map((f: any) => ({
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
        } catch (e: any) {
          reject(new Error(`Failed to parse yt-dlp output: ${e.message}. Raw output: ${data}`));
        }
      } else {
        reject(new Error(`yt-dlp exited with code ${code}. Error: ${errorData || 'No stderr output.'}`));
      }
    });

    ytDlp.on('error', (err: any) => {
      if (err.code === 'ENOENT') {
        reject(new Error('yt-dlp command not found. Please ensure yt-dlp is installed and in your system PATH.'));
      } else {
        reject(new Error(`Failed to start yt-dlp process: ${err.message}`));
      }
    });
  });
};

/**
 * Streams a video/audio download using yt-dlp with proper video+audio combination.
 * @param url The YouTube video URL.
 * @param formatId The format ID to download.
 * @param res The Express response object to stream the file to.
 * @param filename The desired filename for the download.
 */
export const downloadVideo = (url: string, formatId: string, res: Response, filename: string) => {
  // Use yt-dlp to download with proper format selection
  // Different approach: Use -f best[height<=720] for video+audio together
  // or combine specific formats with + operator
  const ytDlpArgs = ['-f', `${formatId}+bestaudio/best`, '--merge-output-format', 'mp4', '--no-cache-dir', '--no-part', '--no-mtime', url, '-o', '-', '--newline'];
  
  console.log('yt-dlp-utils: Spawning yt-dlp for download with args:', ytDlpArgs.join(' '));
  const ytDlpPath = path.join(os.homedir(), 'Downloads', 'yt-dlp.exe');
  const ytDlp = spawn(ytDlpPath, ytDlpArgs);

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'video/mp4'); // Set to video/mp4 for video downloads

  ytDlp.stdout.pipe(res);

  ytDlp.stderr.on('data', (data) => {
    console.error(`yt-dlp stderr during download: ${data}`);
    // Look for progress information in stderr
    const progressMatch = data.toString().match(/(\d+\.\d+)%/);
    if (progressMatch) {
      console.log(`Download progress: ${progressMatch[1]}%`);
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

  ytDlp.on('error', (err: any) => {
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