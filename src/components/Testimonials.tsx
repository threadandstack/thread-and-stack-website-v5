export const Testimonials = () => {
  const testimonials = [
    {
      quote: "Brendan helped us articulate what we'd been feeling but couldn't name. Our positioning is finally clear, and our team actually understands who we're for.",
      author: "Sarah Chen",
      role: "Founder, Impact Studio",
      company: "B Corp Design Agency"
    },
    {
      quote: "The Notion workflows we built together saved us 10+ hours a week. But more importantly, they protected our creative time. That's priceless.",
      author: "Marcus Williams",
      role: "Creative Director",
      company: "Ethical Fashion Collective"
    },
    {
      quote: "We were skeptical about AI, but Brendan showed us how to use it as a thinking partner, not a replacement. It's completely changed how we work.",
      author: "Elena Rodriguez",
      role: "Operations Lead",
      company: "Social Impact Startup"
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-6 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 text-balance font-light">
          What clients say
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative bg-card p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group"
            >
              {/* Thread accent on left */}
              <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-accent/30 group-hover:bg-accent/60 transition-colors" />
              
              <div className="pl-6 space-y-4">
                <p className="text-xl leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="pt-4 border-t border-border/50">
                  <p className="font-light not-italic text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {testimonial.company}
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
