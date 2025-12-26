import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check, RefreshCw, Twitter } from 'lucide-react';
import { useTwitterContent, useGenerateTwitter } from '@/hooks/useContent';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface TwitterTabProps {
  videoId: string;
}

const TwitterTab = ({ videoId }: TwitterTabProps) => {
  const { data: content, isLoading } = useTwitterContent(videoId);
  const generateTwitter = useGenerateTwitter(videoId);
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async (regenerate = false) => {
    try {
      await generateTwitter.mutateAsync({ regenerate });
      toast({
        title: 'Thread generated!',
        description: '1 credit deducted from your account.',
      });
    } catch (error: any) {
      toast({
        title: 'Generation failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyEntireThread = async () => {
    if (!content?.data?.tweets) return;
    const text = content.data.tweets.map((t, i) => `${i + 1}/${content.data.tweets.length}\n\n${t}`).join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: 'Entire thread copied!' });
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Before generation view
  if (!content || content.status !== 'completed') {
    return (
      <Card className="border-sky-500/20 bg-sky-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
            <Twitter className="h-6 w-6 text-sky-500" />
          </div>
          <CardTitle className="text-xl">Twitter Thread</CardTitle>
          <CardDescription className="text-base">
            Generate viral 7-10 tweet thread with hooks and hashtags
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Optimized for engagement
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge variant="outline">Cost: 1 credit</Badge>
            <Badge variant="secondary">Your credits: {profile?.credits_remaining ?? 0}</Badge>
          </div>
          <Button
            onClick={() => handleGenerate(false)}
            disabled={generateTwitter.isPending || (profile?.credits_remaining ?? 0) < 1}
            className="bg-sky-500 hover:bg-sky-600 text-white"
            size="lg"
          >
            {generateTwitter.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Twitter className="mr-2 h-4 w-4" />
                Generate Thread
              </>
            )}
          </Button>
          {(profile?.credits_remaining ?? 0) < 1 && (
            <p className="text-sm text-destructive">Insufficient credits</p>
          )}
        </CardContent>
      </Card>
    );
  }

  // After generation view
  const tweets = content.data.tweets || [];
  const hashtags = content.data.hashtags || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Twitter className="h-5 w-5 text-sky-500" />
          Twitter Thread ({tweets.length} tweets)
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerate(true)}
            disabled={generateTwitter.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generateTwitter.isPending ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </div>

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {hashtags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs text-sky-600">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {tweets.map((tweet, index) => (
          <TweetCard
            key={index}
            tweet={tweet}
            index={index}
            total={tweets.length}
            isCopied={copiedIndex === index}
            onCopy={() => copyToClipboard(tweet, index)}
          />
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={copyEntireThread}
      >
        {copiedAll ? (
          <>
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Thread Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy Entire Thread
          </>
        )}
      </Button>
    </div>
  );
};

interface TweetCardProps {
  tweet: string;
  index: number;
  total: number;
  isCopied: boolean;
  onCopy: () => void;
}

const TweetCard = ({ tweet, index, total, isCopied, onCopy }: TweetCardProps) => (
  <Card className="border-sky-500/10">
    <CardContent className="pt-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Badge variant="secondary" className="mb-2 text-xs">
            Tweet {index + 1}/{total}
          </Badge>
          <p className="text-sm whitespace-pre-wrap">{tweet}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Characters: {tweet.length}/280
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCopy} className="flex-shrink-0">
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default TwitterTab;
