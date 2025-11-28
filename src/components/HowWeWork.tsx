import workshopImage from "@/assets/brendan-collaboration.jpeg";

export const HowWeWork = () => {
  const principles = [
    {
      number: "01",
      title: "Human-first, always",
      description: "No one-size-fits-all playbooks. We start with your reality, your ethics, and your working style."
    },
    {
      number: "02",
      title: "Collaborative, not prescriptive",
      description: "You're not outsourcing your thinking. We're working together to build something that's truly yours."
    },
    {
      number: "03",
      title: "Practical steps, tangible outputs",
      description: "Every session and workshop leaves you with clear language, decisions, and tools you can use immediately."
    },
    {
      number: "04",
      title: "Systems that protect the magic",
      description: "We build workflows that reduce friction and protect creative energy, not replace human judgment."
    }
  ];

  return (
    <section id="how-we-work" className="py-24 px-6 bg-muted/30 border-b-2 thread-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-16 text-balance font-light">
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
                
                <h3 className="text-2xl group-hover:text-accent transition-colors font-light not-italic">
                  {principle.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
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
              
              <h3 className="text-2xl group-hover:text-accent transition-colors font-light not-italic">
                {principle.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
