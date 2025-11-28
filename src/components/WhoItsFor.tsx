import { Check } from "lucide-react";

export const WhoItsFor = () => {
  const audiences = [
    {
      title: "Leaders who've outgrown their old story",
      description: "Your values and ambition have moved on, but your brand is stuck a few chapters back. Different teams tell different versions of the story. Competitors with less depth are claiming your space more loudly."
    },
    {
      title: "Leaders focused on brand cohesion",
      description: "Your brand's intent is clear in leadership's heads, but gets diluted across teams and channels. In key moments—fundraising, launches, partnerships—the brand doesn't land how you hoped."
    },
    {
      title: "Teams who refuse to burn out to scale",
      description: "You're growing, but questioning the cost. Marketing depends on late nights and heroics. You want systems that protect creative energy, not exhaust it."
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 text-balance font-light">
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
              
              <h3 className="text-2xl mb-4 font-light not-italic">
                {audience.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-lg">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
