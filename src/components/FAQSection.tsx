import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How long does it take to process a video?',
    answer: 'Most videos are processed within 2-5 minutes, depending on the length. A 10-minute video typically takes about 3 minutes to transcribe and generate all content formats.',
  },
  {
    question: 'What languages are supported?',
    answer: 'We support 50+ languages including English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, and Punjabi. Our AI is optimized for Indian accents and code-switching between languages.',
  },
  {
    question: 'How accurate is the AI-generated content?',
    answer: 'Our transcription accuracy is typically 95%+ for clear audio. The generated content maintains the key messages from your video while adapting the format for each platform. We recommend reviewing the content before publishing.',
  },
  {
    question: 'Can I edit the generated content?',
    answer: 'Absolutely! All generated content can be edited directly in our platform. You can modify text, regenerate specific sections, or adjust the tone and style to match your brand.',
  },
  {
    question: 'What is your refund policy?',
    answer: 'We offer a 7-day money-back guarantee for all paid plans. If you\'re not satisfied with ContentAI, contact our support team within 7 days of your purchase for a full refund.',
  },
  {
    question: 'Are there any usage limits?',
    answer: 'Usage limits depend on your plan. Free users get 2 videos/month, Pro users get 20 videos/month, and Agency users get unlimited videos. Each video can be up to 2 hours long.',
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about ContentAI.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background rounded-xl border-0 shadow-md px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
