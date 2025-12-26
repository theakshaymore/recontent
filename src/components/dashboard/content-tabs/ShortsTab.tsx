import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check, RefreshCw, Download, Film } from 'lucide-react';
import { useShortsContent, useGenerateShorts } from '@/hooks/useContent';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import type { ShortScript } from '@/types';

interface ShortsTabProps {
  videoId: string;
}

const ShortsTab = ({ videoId }: ShortsTabProps) => {
  const { data: content, isLoading } = useShortsContent(videoId);
  const generateShorts = useGenerateShorts(videoId);
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (regenerate = false) => {
    try {
      await generateShorts.mutateAsync({ regenerate });
      toast({
        title: 'Shorts generated!',
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

  const downloadAll = () => {
    if (!content?.data?.shorts) return;
    const text = content.data.shorts.map((s, i) => 
      `SHORT #${i + 1}\n\nTitle: ${s.title}\nDuration: ${s.duration}\n\n🪝 Hook:\n${s.hook}\n\n📝 Script:\n${s.script}\n\n📢 CTA:\n${s.cta}\n\n---`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-shorts-scripts.txt';
    a.click();
    URL.revokeObjectURL(url);
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
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Film className="h-6 w-6 text-red-500" />
          </div>
          <CardTitle className="text-xl">YouTube Shorts</CardTitle>
          <CardDescription className="text-base">
            Generate 5-7 short video scripts (30-60 seconds each)
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Perfect for viral short-form content
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge variant="outline">Cost: 1 credit</Badge>
            <Badge variant="secondary">Your credits: {profile?.credits_remaining ?? 0}</Badge>
          </div>
          <Button
            onClick={() => handleGenerate(false)}
            disabled={generateShorts.isPending || (profile?.credits_remaining ?? 0) < 1}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            {generateShorts.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Film className="mr-2 h-4 w-4" />
                Generate Shorts
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
  const shorts = content.data.shorts || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Film className="h-5 w-5 text-red-500" />
          YouTube Shorts ({shorts.length} scripts)
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerate(true)}
            disabled={generateShorts.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generateShorts.isPending ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAll}>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {shorts.map((short, index) => (
          <ShortCard
            key={index}
            short={short}
            index={index}
            isCopied={copiedIndex === index}
            onCopy={() => copyToClipboard(
              `${short.hook}\n\n${short.script}\n\n${short.cta}`,
              index
            )}
          />
        ))}
      </div>
    </div>
  );
};

interface ShortCardProps {
  short: ShortScript;
  index: number;
  isCopied: boolean;
  onCopy: () => void;
}

const ShortCard = ({ short, index, isCopied, onCopy }: ShortCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="secondary" className="mb-2">Short #{index + 1}</Badge>
          <CardTitle className="text-base">{short.title}</CardTitle>
          <CardDescription>Duration: {short.duration}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">🪝 Hook (0-3s):</p>
        <p className="text-sm bg-secondary/50 p-3 rounded-lg">{short.hook}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">📝 Script:</p>
        <p className="text-sm bg-secondary/50 p-3 rounded-lg whitespace-pre-wrap">{short.script}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">📢 Call-to-Action:</p>
        <p className="text-sm bg-secondary/50 p-3 rounded-lg">{short.cta}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onCopy}>
        {isCopied ? (
          <>
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy Script
          </>
        )}
      </Button>
    </CardContent>
  </Card>
);

export default ShortsTab;
