import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Youtube, Link, Sparkles } from 'lucide-react';
import { showError } from '@/utils/toast';
import { withSmartlink } from '@/utils/ad-integration';

interface DownloadFormProps {
  onFetchInfo: (url: string) => void;
  isLoading: boolean;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onFetchInfo, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      showError('Please enter a YouTube video URL.');
      return;
    }
    
    withSmartlink(() => {
      onFetchInfo(url);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            YouTube Video Downloader
          </h2>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Download videos in high quality with audio, video, or combined formats
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="youtube-url"
            type="url"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full pl-12 py-6 text-lg rounded-xl border-2 border-muted focus-visible:border-primary/30 transition-colors"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Link className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <Button type="submit" className="py-6 px-8 text-lg rounded-xl" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="text-2xl font-bold text-primary">4K</div>
          <div className="text-xs text-muted-foreground">Quality</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="text-2xl font-bold text-primary">Fast</div>
          <div className="text-xs text-muted-foreground">Processing</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="text-2xl font-bold text-primary">Safe</div>
          <div className="text-xs text-muted-foreground">Download</div>
        </div>
      </div>
    </form>
  );
};

export default DownloadForm;