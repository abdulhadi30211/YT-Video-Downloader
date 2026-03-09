import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Clock, Calendar, Eye, ThumbsUp, Users } from 'lucide-react';

interface VideoInfoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
}

const VideoInfoCard: React.FC<VideoInfoCardProps> = ({ title, thumbnail, duration }) => {
  // Generate mock statistics for the video (in a real app, these would come from the API)
  const views = Math.floor(Math.random() * 10000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const likes = Math.floor(Math.random() * 500000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return (
    <Card className="w-full max-w-4xl overflow-hidden shadow-xl rounded-2xl border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5">
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-t-2xl md:rounded-l-2xl md:rounded-none">
            <img 
              src={thumbnail} 
              alt={title} 
              className="rounded-t-2xl md:rounded-l-2xl md:rounded-none object-cover w-full h-full" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/400x225?text=Thumbnail+Not+Available';
              }}
            />
          </AspectRatio>
        </div>
        <div className="md:w-3/5 p-8">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary p-3 rounded-full shadow-md">
                <Play className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl line-clamp-2 mb-2">{title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Duration:</span>
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Published:</span>
                <span>Just now</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">YouTube Video</h4>
                  <p className="text-sm text-muted-foreground">High quality download available</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <h5 className="font-medium mb-2">Available Formats:</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">MP4</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">WEBM</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">360p</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">720p</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">1080p</span>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default VideoInfoCard;