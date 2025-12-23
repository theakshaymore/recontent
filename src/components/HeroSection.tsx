import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, FileText, Image, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Animated background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Content Repurposing
            </div>

            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Turn One Video Into{' '}
              <span className="gradient-text">10 Pieces of Content</span>{' '}
              in 5 Minutes
            </h1>

            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Paste any YouTube link and let our AI transform it into blog posts, 
              social media content, AI thumbnails, and more. Save hours of content creation time.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Button 
                variant="gradient" 
                size="xl"
                onClick={() => navigate('/signup')}
                className="group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="group"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div 
              className="flex items-center gap-6 pt-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-primary-foreground text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">2,000+</span> creators already using ContentAI
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div 
            className="relative opacity-0 animate-slide-in-right"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 shadow-xl">
              {/* YouTube input mockup */}
              <div className="bg-background rounded-xl p-4 shadow-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-destructive-foreground fill-current" />
                  </div>
                  <div className="flex-1 bg-secondary rounded-lg px-4 py-2 text-sm text-muted-foreground truncate">
                    https://youtube.com/watch?v=...
                  </div>
                </div>
              </div>

              {/* Processing animation */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-muted-foreground ml-2">AI Processing...</span>
              </div>

              {/* Output cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                  <FileText className="w-6 h-6 text-primary mb-2" />
                  <div className="text-sm font-medium">Blog Post</div>
                  <div className="text-xs text-muted-foreground">2,500 words</div>
                </div>
                <div className="bg-background rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                  <Twitter className="w-6 h-6 text-accent mb-2" />
                  <div className="text-sm font-medium">Tweet Thread</div>
                  <div className="text-xs text-muted-foreground">15 tweets</div>
                </div>
                <div className="bg-background rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                  <Image className="w-6 h-6 text-primary mb-2" />
                  <div className="text-sm font-medium">AI Thumbnail</div>
                  <div className="text-xs text-muted-foreground">4 variants</div>
                </div>
                <div className="bg-background rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                  <Sparkles className="w-6 h-6 text-accent mb-2" />
                  <div className="text-sm font-medium">LinkedIn</div>
                  <div className="text-xs text-muted-foreground">Carousel ready</div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-background rounded-xl p-3 shadow-lg animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-medium">Ready!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
