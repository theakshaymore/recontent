import { Link2, Cpu, Eye, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Paste YouTube URL',
    description: 'Simply copy and paste any YouTube video link into ContentAI.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Processes',
    description: 'Our AI transcribes, analyzes, and generates content in multiple formats.',
  },
  {
    number: '03',
    icon: Eye,
    title: 'Review Content',
    description: 'Preview all generated content and make any edits you need.',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download or Schedule',
    description: 'Export your content or schedule posts directly to social platforms.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From YouTube video to multi-platform content in just 4 simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative group opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
              )}

              <div className="relative bg-secondary/50 rounded-2xl p-6 hover:bg-secondary transition-colors duration-300">
                {/* Step number */}
                <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.number}
                </span>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
