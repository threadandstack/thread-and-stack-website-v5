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
    <section id="how-we-work" className="py-24 px-6 bg-secondary/10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-balance">
          How we work
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {principles.map((principle, index) => (
            <div 
              key={index}
              className="space-y-3 group"
            >
              <div className="text-accent font-mono text-sm font-semibold">
                {principle.number}
              </div>
              
              <h3 className="text-2xl font-semibold group-hover:text-accent transition-colors">
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
