import React, { useState } from 'react';
import Header from '@/components/Header';
import UniversalDownloadForm from '@/components/UniversalDownloadForm';
import VideoInfoCard from '@/components/VideoInfoCard';
import UniversalDownloadOptions from '@/components/UniversalDownloadOptions';
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

const Universal = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const handleFetchInfo = async (url: string) => {
    setIsLoading(true);
    setVideoInfo(null); // Clear previous info
    setCurrentVideoUrl(url); // Store the URL for download

    try {
      const response = await fetch(`/api/universal-info?url=${encodeURIComponent(url)}`);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-12 py-12">
        <div className="w-full max-w-4xl text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Tublyx Universal Downloader
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download videos from 1000+ platforms including Facebook, Instagram, TikTok, and more. 
            Fast, secure, and completely free.
          </p>
        </div>
        
        <UniversalDownloadForm onFetchInfo={handleFetchInfo} isLoading={isLoading} />

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
            <UniversalDownloadOptions
              videoFormats={videoInfo.formats}
              videoTitle={videoInfo.title}
              videoUrl={currentVideoUrl}
            />
          </div>
        )}
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

export default Universal;