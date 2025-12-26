import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  FileText, 
  Twitter, 
  Image, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Trash2,
  ExternalLink 
} from 'lucide-react';
import type { Video } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: Video;
  onDelete?: (videoId: string) => void;
  onView?: (videoId: string) => void;
  isDeleting?: boolean;
}

const statusConfig = {
  queued: {
    label: 'Queued',
    icon: Loader2,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    animate: false,
  },
  processing: {
    label: 'Processing',
    icon: Loader2,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    animate: true,
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    animate: false,
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    animate: false,
  },
};

const VideoCard = ({ video, onDelete, onView, isDeleting }: VideoCardProps) => {
  const status = statusConfig[video.status];
  const StatusIcon = status.icon;

  // Extract video ID from YouTube URL for thumbnail
  const getYoutubeThumbnail = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);
    const videoId = match?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
  };

  const thumbnailUrl = getYoutubeThumbnail(video.youtube_url);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 h-32 flex-shrink-0">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.title || 'Video thumbnail'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge className={`${status.color} border`}>
              <StatusIcon className={`w-3 h-3 mr-1 ${status.animate ? 'animate-spin' : ''}`} />
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base line-clamp-1">
              {video.title || 'Untitled Video'}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {video.youtube_url}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
              {video.duration && (
                <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
              )}
            </div>

            {video.status === 'completed' && (
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Blog
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Twitter className="w-3 h-3 mr-1" />
                  Tweets
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Image className="w-3 h-3 mr-1" />
                  Thumbnails
                </Badge>
              </div>
            )}

            {video.status === 'failed' && video.error_message && (
              <p className="text-sm text-destructive mb-3">{video.error_message}</p>
            )}

            <div className="flex items-center gap-2">
              {video.status === 'completed' && onView && (
                <Button size="sm" variant="outline" onClick={() => onView(video.id)}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Content
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(video.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
