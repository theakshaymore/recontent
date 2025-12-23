import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "ContentAI has completely transformed how I repurpose my YouTube content. I used to spend 10+ hours a week creating social media posts. Now it takes me 30 minutes!",
    name: 'Priya Sharma',
    title: 'Tech YouTuber, 500K+ subscribers',
    avatar: 'PS',
  },
  {
    quote: "The AI thumbnails are incredible. My click-through rate has increased by 40% since I started using ContentAI. It's like having a professional designer on demand.",
    name: 'Rahul Verma',
    title: 'Instagram Creator, 200K+ followers',
    avatar: 'RV',
  },
  {
    quote: "As a social media manager handling 10+ clients, ContentAI is a lifesaver. The Hindi transcription is surprisingly accurate, which is crucial for our Indian audience.",
    name: 'Ananya Reddy',
    title: 'Social Media Manager, Digital Agency',
    avatar: 'AR',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by <span className="gradient-text">Creators</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of content creators who are saving time with ContentAI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary/30 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                
                <p className="text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
