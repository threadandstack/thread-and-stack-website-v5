import { Check } from "lucide-react";

export const WhoItsFor = () => {
  const audiences = [
    {
      title: "Values-led founders and small teams",
      description: "You care about mission, impact, and integrity. You want growth without selling out. You need a brand that reflects what you actually believe, and systems that protect the work that matters."
    },
    {
      title: "Overwhelmed operators wearing too many hats",
      description: "You're juggling creative work, operations, and strategy. You feel the drag of messy systems and unclear positioning. You want clarity, focus, and simple ways to get the work done."
    },
    {
      title: "Teams who refuse to burn out to scale",
      description: "You're growing, but you're questioning the cost. You want to protect creative energy, reduce chaos, and build systems that support humans rather than exhaust them."
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-12 text-balance font-light">
          Who this is for
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="bg-card p-8 border-2 thread-border hover:border-accent transition-all duration-300"
            >
              <div className="w-10 h-10 border thread-border flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-accent" />
              </div>
              
              <h3 className="text-xl mb-3 font-light not-italic">
                {audience.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
