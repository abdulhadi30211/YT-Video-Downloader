import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Download, FileVideo, FileAudio, Music, Volume2, VolumeX, Play, Clock, Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { showSuccess, showError } from '@/utils/toast';
import DownloadProgress from '@/components/DownloadProgress';
import { withSmartlink } from '@/utils/ad-integration';

interface VideoFormat {
  format_id: string;
  ext: string;
  resolution: string;
  vcodec: string;
  acodec: string;
  filesize?: number;
  filesize_approx?: number;
}

interface UniversalDownloadOptionsProps {
  videoFormats: VideoFormat[];
  videoTitle: string;
  videoUrl: string;
}

const UniversalDownloadOptions: React.FC<UniversalDownloadOptionsProps> = ({ videoFormats, videoTitle, videoUrl }) => {
  const [selectedFormatId, setSelectedFormatId] = useState<string | null>(null);
  const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [downloadSocketId, setDownloadSocketId] = useState<string | null>(null);

  // Separate video-only and audio-only formats
  const videoOnlyFormats = videoFormats.filter(f => f.vcodec !== 'none' && f.acodec === 'none');
  const audioOnlyFormats = videoFormats.filter(f => f.acodec !== 'none' && f.vcodec === 'none');
  // Video+audio formats (for when user wants combined)
  const videoAudioFormats = videoFormats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none');

  // Sort video+audio formats by resolution to get best quality options
  const sortedVideoAudioFormats = [...videoAudioFormats].sort((a, b) => {
    // Extract numeric value from resolution (e.g., "720p" -> 720)
    const getResolutionNumber = (res: string) => {
      const match = res.match(/(\d+)(p|i)?/);
      return match ? parseInt(match[1]) : 0;
    };
    
    return getResolutionNumber(b.resolution) - getResolutionNumber(a.resolution);
  });

  // Show more quality options - top 10 video+audio formats
  const topVideoAudioFormats = sortedVideoAudioFormats.slice(0, 10);

  // Get selected format to show details
  const selectedFormat = videoFormats.find(f => f.format_id === selectedFormatId);

  const handleDownload = async () => {
    if (!selectedFormatId) {
      showError('Please select a format to download.');
      return;
    }
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setEstimatedTime(null);
    
    // Generate a unique socket ID for this download
    const socketId = `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setDownloadSocketId(socketId);
    
    try {
      if (!selectedFormat) {
        showError('Selected format not found.');
        return;
      }

      const fileExtension = selectedFormat.ext;
      const filename = `${videoTitle.replace(/[^a-z0-9]/gi, '_')}.${fileExtension}`;

      console.log('Frontend: Initiating universal download request with:', { videoUrl, selectedFormatId, filename });

      // Calculate estimated time based on file size (assuming average download speed)
      if (selectedFormat.filesize || selectedFormat.filesize_approx) {
        const sizeInMB = (selectedFormat.filesize || selectedFormat.filesize_approx)! / (1024 * 1024);
        // Assuming 2 MB/s as average download speed - adjust as needed
        const estimatedSeconds = Math.round(sizeInMB / 2);
        const minutes = Math.floor(estimatedSeconds / 60);
        const seconds = estimatedSeconds % 60;
        setEstimatedTime(`${minutes}m ${seconds}s`);
      }

      // Simulate download progress (since actual progress tracking requires backend changes)
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95; // Keep at 95% until download completes
          }
          return prev + 2; // Slower progress to simulate longer downloads
        });
      }, 1000); // Update every second

      // Create a temporary download link that directly points to the backend endpoint
      const downloadUrl = `/api/universal-download?url=${encodeURIComponent(videoUrl)}&formatId=${encodeURIComponent(selectedFormatId!)}&filename=${encodeURIComponent(filename)}&socketId=${encodeURIComponent(downloadSocketId!)}`;
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      // Show download started message
      showSuccess('Download started! Check your browser downloads.');
      
      // Clear the progress interval
      clearInterval(progressInterval);
      setDownloadProgress(100);
    } catch (error: any) {
      console.error('Download error:', error);
      showError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsDownloading(false);
      setTimeout(() => {
        setDownloadProgress(0);
        setEstimatedTime(null);
      }, 1000); // Reset progress after 1 second
    }
  };

  const handleAd = () => {
    withSmartlink(() => {
      console.log('Ad window opened for universal download');
    });
  };

  React.useEffect(() => {
    // Reset selected format when download type changes
    setSelectedFormatId(null);
  }, [downloadType]);

  // Format file size for display
  const formatFileSize = (format: VideoFormat) => {
    // Prioritize exact filesize, then try filesize_approx
    const size = format.filesize || format.filesize_approx;
    
    if (!size) {
      return 'Size N/A';
    }
    
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Extract quality from resolution for display
  const formatQuality = (resolution: string) => {
    if (!resolution) return 'Unknown Quality';
    // Handle cases like "1280x720" or "720p"
    const match = resolution.match(/(\d+)[x|p](\d+)?/);
    if (match) {
      const firstNum = parseInt(match[1]);
      // For formats like "720p", just return the quality
      if (resolution.includes('p')) {
        return `${firstNum}p`;
      } else if (resolution.includes('x')) {
        // For formats like "1280x720", get the height
        const secondNum = match[2] ? parseInt(match[2]) : 0;
        return `${secondNum}p`;
      }
    }
    return 'Standard';
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 border rounded-xl shadow-lg bg-card text-card-foreground">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Universal Download Options</h3>
      </div>

      <RadioGroup
        defaultValue="video"
        onValueChange={(value: 'video' | 'audio') => setDownloadType(value)}
        className="flex flex-wrap gap-2"
      >
        <div className={`flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors ${downloadType === 'video' ? 'border-primary bg-accent' : ''}`}>
          <RadioGroupItem value="video" id="universal-video-type" />
          <Label htmlFor="universal-video-type" className="flex items-center gap-2">
            <FileVideo className="h-4 w-4" />
            Video
          </Label>
        </div>
        <div className={`flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors ${downloadType === 'audio' ? 'border-primary bg-accent' : ''}`}>
          <RadioGroupItem value="audio" id="universal-audio-type" />
          <Label htmlFor="universal-audio-type" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Audio
          </Label>
        </div>
      </RadioGroup>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="universal-format-select">Select Format</Label>
        <Select onValueChange={setSelectedFormatId} value={selectedFormatId || ''}>
          <SelectTrigger id="universal-format-select" className="w-full">
            <SelectValue placeholder="Choose a format" />
          </SelectTrigger>
          <SelectContent>
            {downloadType === 'video' && (
              <>
                {topVideoAudioFormats.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Video + Audio (With Sound) - Quality Options</div>
                    {topVideoAudioFormats.map((format) => (
                      <SelectItem key={format.format_id} value={format.format_id}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Play className="h-3 w-3 text-primary" />
                            <span>{formatQuality(format.resolution)}</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">.{format.ext}</span>
                          <span className="text-xs text-muted-foreground ml-2">{formatFileSize(format)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                {videoOnlyFormats.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Video Only (Muted) - Quality Options</div>
                    {videoOnlyFormats.map((format) => (
                      <SelectItem key={format.format_id} value={format.format_id}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <VolumeX className="h-3 w-3 text-muted-foreground" />
                            <span>{formatQuality(format.resolution)}</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">.{format.ext}</span>
                          <span className="text-xs text-muted-foreground ml-2">{formatFileSize(format)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </>
            )}
            {downloadType === 'audio' && audioOnlyFormats.length > 0 && (
              <>
                {audioOnlyFormats.map((format) => (
                  <SelectItem key={format.format_id} value={format.format_id}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-3 w-3 text-primary" />
                        <span>{format.ext.toUpperCase()}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">{formatFileSize(format)}</span>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
            {((downloadType === 'video' && topVideoAudioFormats.length === 0 && videoOnlyFormats.length === 0) || 
              (downloadType === 'audio' && audioOnlyFormats.length === 0)) && (
              <SelectItem value="no-formats" disabled>
                No formats available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Show selected format details */}
      {selectedFormat && (
        <div className="p-4 bg-muted rounded-lg border">
          <h4 className="font-medium mb-2">Selected Format Details:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Quality:</span> {formatQuality(selectedFormat.resolution)}</div>
            <div><span className="text-muted-foreground">Format:</span> {selectedFormat.ext}</div>
            <div><span className="text-muted-foreground">File Size:</span> {formatFileSize(selectedFormat)}</div>
            <div><span className="text-muted-foreground">Type:</span> 
              {selectedFormat.vcodec !== 'none' && selectedFormat.acodec !== 'none' && ' Video + Audio'}
              {selectedFormat.vcodec !== 'none' && selectedFormat.acodec === 'none' && ' Video Only'}
              {selectedFormat.vcodec === 'none' && selectedFormat.acodec !== 'none' && ' Audio Only'}
            </div>
          </div>
        </div>
      )}

      {/* Show Download Progress Component when downloading */}
      {isDownloading && selectedFormat && downloadSocketId && (
        <DownloadProgress 
          url={videoUrl}
          formatId={selectedFormatId!}
          filename={`${videoTitle.replace(/[^a-z0-9]/gi, '_')}.${selectedFormat.ext}`}
          socketId={downloadSocketId}
          onDownloadComplete={() => {
            setIsDownloading(false);
            showSuccess('Download completed successfully!');
          }}
          onDownloadError={(error) => {
            setIsDownloading(false);
            showError(`Download failed: ${error}`);
          }}
        />
      )}

      <div className="flex space-x-3">
        <Button 
          onClick={handleDownload} 
          className="flex-1 py-6 text-lg" 
          disabled={isDownloading || !selectedFormatId}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Downloading... {selectedFormat && `(${formatFileSize(selectedFormat)})`}
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download Now
            </>
          )}
        </Button>
        <Button 
          onClick={handleAd} 
          className="py-6 px-4 bg-primary/10 hover:bg-primary/20" 
          disabled={isDownloading || !selectedFormatId}
          title="Support our service"
        >
          <span className="text-xs">Support</span>
        </Button>
      </div>
    </div>
  );
};

export default UniversalDownloadOptions;