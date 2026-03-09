import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DownloadForm from '@/components/DownloadForm';
import VideoInfoCard from '@/components/VideoInfoCard';
import DownloadOptions from '@/components/DownloadOptions';
import PlaylistDownloader from '@/components/PlaylistDownloader';
import { showError } from '@/utils/toast';

interface VideoFormat {
  format_id: string;
  ext: string;
  resolution: string;
  vcodec: string;
  acodec: string;
  filesize?: number;
  filesize_approx?: number;
}

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration_string: string;
  formats: VideoFormat[];
}

const Index = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'youtube' | 'playlist'>('youtube');

  // Add event listener to handle messages from other tabs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message:', event.data); // Debug log
      if (event.data && event.data.type === 'AUTO_FILL_URL') {
        setCurrentVideoUrl(event.data.url);
        handleFetchInfo(event.data.url);
        setActiveTab('youtube');
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleFetchInfo = async (url: string) => {
    setIsLoading(true);
    setVideoInfo(null); // Clear previous info
    setCurrentVideoUrl(url); // Store the URL for download

    try {
      const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (response.ok) {
        setVideoInfo(data);
      } else {
        showError(`Error: ${data.error || 'Failed to fetch video information.'}`);
      }
    } catch (error: any) {
      console.error('Fetch video info error:', error);
      showError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelectFromPlaylist = (videoUrl: string) => {
    // Auto-fill the video URL in the YouTube downloader
    setCurrentVideoUrl(videoUrl);
    handleFetchInfo(videoUrl);
    
    // Switch to the YouTube downloader tab
    setActiveTab('youtube');
  };

  // Function to open video in a new tab and auto-fill
  const handleVideoSelectNewTab = (videoUrl: string) => {
    // Create a new window
    const newWindow = window.open('/', '_blank');
    if (newWindow) {
      // Send message to the new window to auto-fill
      setTimeout(() => {
        newWindow.postMessage({ type: 'AUTO_FILL_URL', url: videoUrl }, '*');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-12 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Tublyx - Free Video Downloader
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download videos from YouTube, Facebook, Instagram, TikTok, and 1000+ platforms. 
              Fast, secure, and completely free.
            </p>
          </div>
          
          <div className="flex border-b border-muted mb-8">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'youtube' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('youtube')}
            >
              YouTube Video Downloader
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'playlist' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('playlist')}
            >
              YouTube Playlist Downloader
            </button>
          </div>
          
          {activeTab === 'youtube' && (
            <div className="space-y-6">
              <DownloadForm onFetchInfo={handleFetchInfo} isLoading={isLoading} />

              {isLoading && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">Analyzing video details...</p>
                </div>
              )}

              {videoInfo && (
                <div className="w-full max-w-6xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
                  <VideoInfoCard
                    title={videoInfo.title}
                    thumbnail={videoInfo.thumbnail}
                    duration={videoInfo.duration_string}
                  />
                  <DownloadOptions
                    videoFormats={videoInfo.formats}
                    videoTitle={videoInfo.title}
                    videoUrl={currentVideoUrl}
                  />
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'playlist' && (
            <div className="space-y-6">
              <PlaylistDownloader onVideoSelect={handleVideoSelectFromPlaylist} isLoading={isLoading} />
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 bg-muted text-foreground border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Tublyx</h3>
              <p className="text-sm text-muted-foreground">Free Video Downloader for 1000+ Platforms</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-1">Owner & Web Developer: Abdulhadi</p>
              <p className="text-sm text-muted-foreground">
                Portfolio: <a href="https://portfolio-abdulhadi1.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://portfolio-abdulhadi1.vercel.app/</a>
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Tublyx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
