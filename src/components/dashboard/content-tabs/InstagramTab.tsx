import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check, RefreshCw, Download, Instagram } from 'lucide-react';
import { useInstagramContent, useGenerateInstagram } from '@/hooks/useContent';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import type { ReelScript } from '@/types';

interface InstagramTabProps {
  videoId: string;
}

const InstagramTab = ({ videoId }: InstagramTabProps) => {
  const { data: content, isLoading } = useInstagramContent(videoId);
  const generateInstagram = useGenerateInstagram(videoId);
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async (regenerate = false) => {
    try {
      await generateInstagram.mutateAsync({ regenerate });
      toast({
        title: 'Reels generated!',
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

  const copyToClipboard = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadAll = () => {
    if (!content?.data?.reels) return;
    const text = content.data.reels.map((r, i) => 
      `REEL #${i + 1}\n\nTitle: ${r.title}\nDuration: ${r.duration}\n\n🪝 Hook:\n${r.hook}\n\n📝 Script:\n${r.script}\n\n💬 Caption:\n${r.caption}\n\n#️⃣ Hashtags:\n${r.hashtags.join(' ')}\n\n---`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instagram-reels-scripts.txt';
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
      <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-4">
            <Instagram className="h-6 w-6 text-pink-500" />
          </div>
          <CardTitle className="text-xl">Instagram Reels</CardTitle>
          <CardDescription className="text-base">
            Generate 5-7 vertical video scripts optimized for Instagram
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Includes captions with hashtags
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge variant="outline">Cost: 1 credit</Badge>
            <Badge variant="secondary">Your credits: {profile?.credits_remaining ?? 0}</Badge>
          </div>
          <Button
            onClick={() => handleGenerate(false)}
            disabled={generateInstagram.isPending || (profile?.credits_remaining ?? 0) < 1}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            size="lg"
          >
            {generateInstagram.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Instagram className="mr-2 h-4 w-4" />
                Generate Reels
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
  const reels = content.data.reels || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-500" />
          Instagram Reels ({reels.length} scripts)
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerate(true)}
            disabled={generateInstagram.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generateInstagram.isPending ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAll}>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {reels.map((reel, index) => (
          <ReelCard
            key={index}
            reel={reel}
            index={index}
            copiedField={copiedField}
            onCopyScript={() => copyToClipboard(
              `${reel.hook}\n\n${reel.script}`,
              `script-${index}`
            )}
            onCopyCaption={() => copyToClipboard(
              `${reel.caption}\n\n${reel.hashtags.join(' ')}`,
              `caption-${index}`
            )}
          />
        ))}
      </div>
    </div>
  );
};

interface ReelCardProps {
  reel: ReelScript;
  index: number;
  copiedField: string | null;
  onCopyScript: () => void;
  onCopyCaption: () => void;
}

const ReelCard = ({ reel, index, copiedField, onCopyScript, onCopyCaption }: ReelCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="secondary" className="mb-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            Reel #{index + 1}
          </Badge>
          <CardTitle className="text-base">{reel.title}</CardTitle>
          <CardDescription>Duration: {reel.duration}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">🪝 Hook (0-3s):</p>
        <p className="text-sm bg-secondary/50 p-3 rounded-lg">{reel.hook}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">📝 Script:</p>
        <p className="text-sm bg-secondary/50 p-3 rounded-lg whitespace-pre-wrap">{reel.script}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">💬 Caption:</p>
        <p className="text-sm bg-secondary/50 p-3 rounded-lg">{reel.caption}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">#️⃣ Hashtags:</p>
        <div className="flex flex-wrap gap-1">
          {reel.hashtags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCopyScript}>
          {copiedField === `script-${index}` ? (
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
        <Button variant="outline" size="sm" onClick={onCopyCaption}>
          {copiedField === `caption-${index}` ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Caption
            </>
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default InstagramTab;
