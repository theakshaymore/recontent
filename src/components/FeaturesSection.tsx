import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Grid3X3, ImageIcon } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'AI-Powered Transcription',
    description: 'Leveraging Whisper AI for industry-leading accuracy. Supports multiple languages including Hindi, Tamil, Telugu, and more Indian languages.',
  },
  {
    icon: Grid3X3,
    title: 'Multi-Format Content',
    description: 'Generate blog posts, LinkedIn carousels, Twitter/X threads, Instagram captions, YouTube descriptions, and email newsletters from a single video.',
  },
  {
    icon: ImageIcon,
    title: 'AI Thumbnails',
    description: 'Create stunning, click-worthy thumbnails using DALL·E 3. Generate multiple variants optimized for different platforms.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Repurpose Content</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform handles the heavy lifting so you can focus on what matters — creating great content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
