export const Testimonials = () => {
  const testimonials = [
    {
      quote: "Brendan quickly built trust among our stakeholders, boosting marketing efficiency through creative strategy and consulting.",
      author: "Xania Khan",
      role: "Head of Content Strategy",
      company: "eBay"
    },
    {
      quote: "Brendan has been a dream. His support totally invigorated us. We've made more progress in the last couple of months than we had in the previous year.",
      author: "Alex Aggidis",
      role: "Head of Marketing",
      company: "Fundraising Everywhere"
    },
    {
      quote: "Brendan is one of the most tenacious marketers I've met, fast to action plans with exceptional follow through to get the job done.",
      author: "Courtney Evans",
      role: "CEO",
      company: "Funraisin"
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
