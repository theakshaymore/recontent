import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Youtube, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateVideo } from '@/hooks/useVideos';
import { useProfile } from '@/hooks/useProfile';

interface ProcessVideoFormProps {
  onSuccess?: () => void;
}

const ProcessVideoForm = ({ onSuccess }: ProcessVideoFormProps) => {
  const { toast } = useToast();
  const { data: profile } = useProfile();
  const createVideo = useCreateVideo();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]{11}/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYoutubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    // Check credits
    if (profile && profile.credits_remaining <= 0) {
      toast({
        title: 'No credits remaining',
        description: 'Please upgrade your plan to process more videos.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createVideo.mutateAsync(youtubeUrl);
      toast({
        title: 'Video queued!',
        description: 'Your video is being processed. This may take a few minutes.',
      });
      setYoutubeUrl('');
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: 'Failed to process video',
        description: err.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Process New Video
        </CardTitle>
        <CardDescription>
          Paste a YouTube URL to generate blog posts, social content, and thumbnails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">YouTube URL</Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setError('');
                }}
                className={`pl-10 ${error ? 'border-destructive' : ''}`}
                disabled={createVideo.isPending}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={createVideo.isPending || !youtubeUrl.trim()}
          >
            {createVideo.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>

          {profile && (
            <p className="text-sm text-center text-muted-foreground">
              {profile.credits_remaining} credits remaining this month
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProcessVideoForm;
