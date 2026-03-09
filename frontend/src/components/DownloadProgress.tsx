import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DownloadProgressProps {
  url: string;
  formatId: string;
  filename: string;
  socketId: string;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: string) => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ 
  url, 
  formatId, 
  filename, 
  socketId,
  onDownloadComplete,
  onDownloadError
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<string>('');
  const [eta, setEta] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket;
    
    // Dynamically import socket.io-client
    const loadSocket = async () => {
      const { io } = await import('socket.io-client');
      socket = io('http://localhost:4000', {
        query: { socketId: socketId }
      }); // Use the same port as your backend

      socket.on('connect', () => {
        console.log('Connected to WebSocket server with ID:', socket.id);
        // Join a room specific to this download
        socket.emit('joinDownloadRoom', socketId);
      });

      socket.on('downloadProgress', (data) => {
        if (data.url === url && data.formatId === formatId) {
          setProgress(data.progress);
          if (data.speed) setSpeed(data.speed);
          if (data.eta) setEta(data.eta);
        }
      });

      socket.on('downloadComplete', (data) => {
        console.log('Download complete:', data);
        setIsDownloading(false);
        if (onDownloadComplete) onDownloadComplete();
      });

      socket.on('downloadError', (data) => {
        console.error('Download error:', data.error);
        setError(data.error);
        setIsDownloading(false);
        if (onDownloadError) onDownloadError(data.error);
      });

      // Clean up
      return () => {
        if (socket) {
          socket.off('downloadProgress');
          socket.off('downloadComplete');
          socket.off('downloadError');
          socket.disconnect();
        }
      };
    };

    loadSocket();
  }, [url, formatId, onDownloadComplete, onDownloadError]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Download Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Downloading: {filename}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Speed:</span>{' '}
            <Badge variant="secondary">{speed || 'Calculating...'}</Badge>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">ETA:</span>{' '}
            <Badge variant="secondary">{eta || 'Calculating...'}</Badge>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-500">
            Error: {error}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Status: {isDownloading ? 'Downloading...' : error ? 'Failed' : 'Completed'}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadProgress;