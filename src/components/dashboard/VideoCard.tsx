import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Play, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import type { Video } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import ContentTabs from './ContentTabs';

interface VideoCardProps {
  video: Video;
  onDelete?: (videoId: string) => void;
  isDeleting?: boolean;
}

const statusConfig = {
  queued: {
    label: 'Queued',
    icon: Clock,
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
    label: 'Transcription Complete',
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

const VideoCard = ({ video, onDelete, isDeleting }: VideoCardProps) => {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const status = statusConfig[video.status];
  const StatusIcon = status.icon;

  // Extract video ID from YouTube URL for thumbnail
  const getYoutubeThumbnail = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);
    const videoId = match?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
  };

  const thumbnailUrl = getYoutubeThumbnail(video.youtube_url);
  const transcriptPreview = video.transcript?.slice(0, 200) || '';
  const hasTranscript = video.transcript && video.transcript.length > 0;

  return (
    <Card className="overflow-hidden">
      {/* Video Header */}
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

            {video.status === 'failed' && video.error_message && (
              <p className="text-sm text-destructive mb-3">{video.error_message}</p>
            )}

            <div className="flex items-center gap-2">
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

      {/* Transcript Section (only show if completed) */}
      {video.status === 'completed' && hasTranscript && (
        <div className="border-t border-border px-4 py-3">
          <Collapsible open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  {transcriptPreview}
                  {video.transcript && video.transcript.length > 200 && '...'}
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  {isTranscriptOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show Full
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-3">
              <div className="max-h-64 overflow-y-auto bg-secondary/50 p-3 rounded-lg text-sm">
                {video.transcript}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {/* Content Generation Tabs (only show if completed) */}
      {video.status === 'completed' && (
        <div className="border-t border-border p-4">
          <ContentTabs videoId={video.id} />
        </div>
      )}
    </Card>
  );
};

export default VideoCard;
