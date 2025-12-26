import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check, RefreshCw, Download, Linkedin } from 'lucide-react';
import { useLinkedInContent, useGenerateLinkedIn } from '@/hooks/useContent';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import type { CarouselSlide } from '@/types';

interface LinkedInTabProps {
  videoId: string;
}

const LinkedInTab = ({ videoId }: LinkedInTabProps) => {
  const { data: content, isLoading } = useLinkedInContent(videoId);
  const generateLinkedIn = useGenerateLinkedIn(videoId);
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async (regenerate = false) => {
    try {
      await generateLinkedIn.mutateAsync({ regenerate });
      toast({
        title: 'Carousel generated!',
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

  const copyToClipboard = async (slide: CarouselSlide, index: number) => {
    const text = `Slide ${slide.slide_number}\n\n📌 Title:\n${slide.title}\n\n💡 Content:\n${slide.content}\n\n🎨 Design Notes:\n${slide.design_notes}`;
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllSlides = async () => {
    if (!content?.data?.slides) return;
    const text = content.data.slides.map(s => 
      `SLIDE ${s.slide_number}\n\n📌 Title:\n${s.title}\n\n💡 Content:\n${s.content}\n\n🎨 Design Notes:\n${s.design_notes}`
    ).join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: 'All slides copied!' });
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadAll = () => {
    if (!content?.data?.slides) return;
    const text = content.data.slides.map(s => 
      `SLIDE ${s.slide_number}\n\n📌 Title:\n${s.title}\n\n💡 Content:\n${s.content}\n\n🎨 Design Notes:\n${s.design_notes}\n\n---`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkedin-carousel.txt';
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
      <Card className="border-blue-600/20 bg-blue-600/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
            <Linkedin className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">LinkedIn Carousel</CardTitle>
          <CardDescription className="text-base">
            Generate professional 10-slide carousel for LinkedIn
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Optimized for thought leadership
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge variant="outline">Cost: 1 credit</Badge>
            <Badge variant="secondary">Your credits: {profile?.credits_remaining ?? 0}</Badge>
          </div>
          <Button
            onClick={() => handleGenerate(false)}
            disabled={generateLinkedIn.isPending || (profile?.credits_remaining ?? 0) < 1}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {generateLinkedIn.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Linkedin className="mr-2 h-4 w-4" />
                Generate Carousel
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
  const slides = content.data.slides || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-blue-600" />
          LinkedIn Carousel ({slides.length} slides)
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerate(true)}
            disabled={generateLinkedIn.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generateLinkedIn.isPending ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAll}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="p-3 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
        ℹ️ Design these slides in Canva or Figma using the content below
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <SlideCard
            key={index}
            slide={slide}
            index={index}
            total={slides.length}
            isCopied={copiedIndex === index}
            onCopy={() => copyToClipboard(slide, index)}
          />
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={copyAllSlides}
      >
        {copiedAll ? (
          <>
            <Check className="h-4 w-4 mr-2 text-green-500" />
            All Slides Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy All Slides
          </>
        )}
      </Button>
    </div>
  );
};

interface SlideCardProps {
  slide: CarouselSlide;
  index: number;
  total: number;
  isCopied: boolean;
  onCopy: () => void;
}

const SlideCard = ({ slide, index, total, isCopied, onCopy }: SlideCardProps) => (
  <Card className="border-blue-600/10">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <Badge variant="secondary" className="bg-blue-600/10 text-blue-600">
          Slide {slide.slide_number}/{total}
          {slide.slide_number === total && ' (CTA)'}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onCopy}>
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">📌 Title:</p>
        <p className="text-sm font-semibold">{slide.title}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">💡 Content:</p>
        <p className="text-sm bg-secondary/50 p-3 rounded-lg whitespace-pre-wrap">{slide.content}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">🎨 Design Notes:</p>
        <p className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded">{slide.design_notes}</p>
      </div>
    </CardContent>
  </Card>
);

export default LinkedInTab;
