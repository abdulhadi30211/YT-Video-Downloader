import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Youtube, Link, Play, ExternalLink } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { withSmartlink } from '@/utils/ad-integration';

interface PlaylistVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
}

interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_count: number;
  uploader: string;
  videos: PlaylistVideo[];
}

interface PlaylistDownloaderProps {
  onVideoSelect: (videoUrl: string) => void;
  isLoading: boolean;
}

const PlaylistDownloader: React.FC<PlaylistDownloaderProps> = ({ onVideoSelect, isLoading }) => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl) {
      showError('Please enter a YouTube playlist URL.');
      return;
    }
    
    withSmartlink(async () => {
      setIsFetching(true);
      setPlaylistInfo(null);
      
      try {
        // Extract playlist ID from URL
        const playlistId = extractPlaylistId(playlistUrl);
        if (!playlistId) {
          showError('Invalid YouTube playlist URL. Please check the URL and try again.');
          return;
        }
        
        const response = await fetch(`/api/playlist-info?id=${playlistId}`);
        const data = await response.json();
        
        if (response.ok) {
          setPlaylistInfo(data);
        } else {
          showError(`Error: ${data.error || 'Failed to fetch playlist information.'}`);
        }
      } catch (error: any) {
        console.error('Fetch playlist info error:', error);
        showError(`An unexpected error occurred: ${error.message}`);
      } finally {
        setIsFetching(false);
      }
    });
  };

  const extractPlaylistId = (url: string): string | null => {
    // Match various YouTube playlist URL formats
    const patterns = [
      /[?&]list=([^&]+)/,
      /playlist\?list=([^&]+)/,
      /(?:youtube\.com\/|youtu\.be\/)playlist\?list=([a-zA-Z0-9_-]+)/,
      /(?:youtube\.com\/|youtu\.be\/)embed\/[a-zA-Z0-9_-]+\?list=([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const handleVideoSelect = (videoUrl: string) => {
    onVideoSelect(videoUrl);
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Youtube className="h-5 w-5 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            YouTube Playlist Downloader
          </h2>
          <Youtube className="h-5 w-5 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Enter a YouTube playlist URL to see all videos and download individually
        </p>
<p className="text-sm text-muted-foreground max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded p-3">
  <span className="font-semibold">Note:</span> If the download doesn't load automatically in a new tab, please copy the video URL from the list and paste it manually on the main page.
</p>
<p>https://youtube.com/playlist?list=PLdf-5pCAtqeK1WDiQYRU7SrA5adriy6Qh&si=h9i50D_QrplsjrTW</p>
      </div>
      
      <form onSubmit={handleFetchPlaylist} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="playlist-url"
            type="url"
            placeholder="Paste YouTube playlist URL here..."
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            required
            className="w-full pl-12 py-6 text-lg rounded-xl border-2 border-muted focus-visible:border-primary/30 transition-colors"
            disabled={isFetching || isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Link className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <Button type="submit" className="py-6 px-8 text-lg rounded-xl" disabled={isFetching || isLoading}>
          {isFetching ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Load Playlist
            </>
          )}
        </Button>
      </form>
      
      {isFetching && (
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Fetching playlist information...</p>
        </div>
      )}

      {playlistInfo && (
        <div className="space-y-6">
          <div className="p-6 bg-card rounded-xl border shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={playlistInfo.thumbnail} 
                alt={playlistInfo.title} 
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{playlistInfo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{playlistInfo.uploader}</p>
                <p className="text-sm text-muted-foreground mt-2">{playlistInfo.video_count} videos</p>
                <p className="text-sm mt-2 line-clamp-2">{playlistInfo.description}</p>
              </div>
            </div>
          </div>
      
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Playlist Videos ({playlistInfo.videos.length})</h4>
            <div className="border rounded-xl overflow-hidden shadow-lg">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/20">
                  <tr>
                    <th className="p-4 text-left text-sm font-bold text-foreground uppercase tracking-wider w-12">#</th>
                    <th className="p-4 text-left text-sm font-bold text-foreground uppercase tracking-wider w-32">Thumbnail</th>
                    <th className="p-4 text-left text-sm font-bold text-foreground uppercase tracking-wider flex-1">Title</th>
                    <th className="p-4 text-left text-sm font-bold text-foreground uppercase tracking-wider w-48">Video URL</th>
                    <th className="p-4 text-left text-sm font-bold text-foreground uppercase tracking-wider w-32">Duration</th>
                    <th className="p-4 text-left text-sm font-bold text-foreground uppercase tracking-wider w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {playlistInfo.videos.map((video, index) => (
                    <tr 
                      key={video.id} 
                      className="hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 cursor-pointer border-b border-border/30 last:border-0"
                    >
                      <td className="p-4 text-sm font-bold text-foreground/90">{index + 1}</td>
                      <td className="p-4">
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden shadow-sm">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://placehold.co/96x64?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 rounded-lg border border-border/20"></div>
                        </div>
                      </td>
                      <td className="p-4 text-sm max-w-xs">
                        <div className="line-clamp-2 font-medium text-foreground hover:text-primary transition-colors">{video.title}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="text" 
                            value={video.url}
                            readOnly
                            className="text-xs bg-muted rounded px-2 py-1 max-w-[120px] truncate cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              const target = e.target as HTMLInputElement;
                              target.select();
                              navigator.clipboard.writeText(video.url)
                                .then(() => {
                                  showSuccess('URL copied to clipboard!');
                                })
                                .catch((err) => {
                                  console.error('Failed to copy: ', err);
                                  showError('Failed to copy URL to clipboard');
                                });
                            }}
                            title="Click to copy URL"
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(video.url)
                                .then(() => {
                                  showSuccess('URL copied to clipboard!');
                                })
                                .catch((err) => {
                                  console.error('Failed to copy: ', err);
                                  showError('Failed to copy URL to clipboard');
                                });
                            }}
                            title="Copy URL"
                          >
                            📋
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground font-medium">{video.duration}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="shadow-md hover:shadow-lg transition-shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                                                    
                              // Open in a new tab with the video URL as a parameter
                              // This will auto-fill and start download in the new tab
                              const newWindow = window.open('/', '_blank');
                                                      
                              console.log('Opening new window and preparing to send URL:', video.url); // Debug log
                                                      
                              // Check if the new window is loaded before sending the message
                              const checkReady = () => {
                                if (newWindow && !newWindow.closed && newWindow.location.href !== 'about:blank') {
                                  console.log('New window is ready, sending message:', { type: 'AUTO_FILL_URL', url: video.url }); // Debug log
                                  // Send message to the new window to auto-fill the URL
                                  newWindow.postMessage({ type: 'AUTO_FILL_URL', url: video.url }, '*');
                                } else {
                                  console.log('New window not ready, retrying...'); // Debug log
                                  // Try again after a short delay
                                  setTimeout(checkReady, 500);
                                }
                              };
                                                      
                              // Start checking if the window is ready
                              setTimeout(checkReady, 1000);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="shadow-md hover:shadow-lg transition-shadow bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              withSmartlink(() => {
                                // This will open the ad window
                                console.log('Ad window opened for video:', video.title);
                              });
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDownloader;