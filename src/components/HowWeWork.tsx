import workshopImage from "@/assets/brendan-collaboration.jpeg";

export const HowWeWork = () => {
  const principles = [
    {
      number: "01",
      title: "Start with your reality",
      description: "No generic playbooks or cookie-cutter processes. Every engagement begins with understanding your specific context, ethics, and working style."
    },
    {
      number: "02",
      title: "Build together",
      description: "You're not outsourcing your thinking to a consultant. We collaborate to create clarity, language, and systems that are genuinely yours."
    },
    {
      number: "03",
      title: "Ship tangible outputs",
      description: "Every session delivers clear language, actionable decisions, and practical tools you can use immediately—not vague frameworks."
    },
    {
      number: "04",
      title: "Protect what matters",
      description: "We design workflows that reduce friction and creative tax while preserving human judgment, taste, and the work you care about."
    }
  ];

  return (
    <section id="how-we-work" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 text-balance font-light">
          How we work
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1">
            <img 
              src={workshopImage} 
              alt="Collaborative workshop session"
              className="border-2 thread-border w-full h-auto"
            />
          </div>
          
          <div className="order-1 md:order-2 space-y-8">
            {principles.slice(0, 2).map((principle, index) => (
              <div 
                key={index}
                className="space-y-3 group border-l-2 thread-border pl-6"
              >
                <div className="text-accent text-sm not-italic font-light">
                  {principle.number}
                </div>
                
                <h3 className="text-2xl md:text-3xl group-hover:text-accent transition-colors font-light not-italic">
                  {principle.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {principles.slice(2).map((principle, index) => (
            <div 
              key={index + 2}
              className="space-y-3 group border-l-2 thread-border pl-6"
            >
              <div className="text-accent text-sm not-italic font-light">
                {principle.number}
              </div>
              
              <h3 className="text-2xl md:text-3xl group-hover:text-accent transition-colors font-light not-italic">
                {principle.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-lg">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
