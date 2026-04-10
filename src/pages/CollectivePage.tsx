import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Users, Sparkles, Target, Palette } from "lucide-react";
import brendanAvatar from "@/assets/brendan-avatar.webp";

const CollectivePage = () => {
  const collectiveMembers = [
    {
      name: "Brendan Rodgers",
      role: "Founder & Lead Strategist",
      image: brendanAvatar,
      bio: "Brand strategist, designer, and systems thinker helping purpose-led teams build marketing that feels more human. Over a decade of experience bridging creative direction with strategic clarity.",
      expertise: ["Brand Strategy", "Creative Direction", "AI Workflows", "Systems Design"]
    }
  ];

  const collaborators = [
    {
      category: "Strategy & Research",
      description: "When projects require deeper research capabilities, market analysis, or specialized strategic expertise.",
      icon: <Target className="w-6 h-6" />
    },
    {
      category: "Design & Production",
      description: "For visual identity systems, motion design, illustration, photography, and asset production at scale.",
      icon: <Palette className="w-6 h-6" />
    },
    {
      category: "Technical & Development",
      description: "When strategy needs to be implemented in code, platforms, or complex technical systems.",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent mb-2 not-italic">The People Behind the Work</p>
            <h1 className="text-5xl md:text-6xl mb-6 text-balance font-light">
              Meet the Collective
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent">
              <p className="text-lg text-muted-foreground">
                Thread & Stack is built around a core philosophy: the right expertise for the right challenge. A lean core team, supported by a network of trusted specialists who bring depth when projects need it.
              </p>
            </div>
          </div>

          {/* Core Team */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-light">Core Team</h2>
                <p className="text-muted-foreground">The foundation of every engagement</p>
              </div>
            </div>

            <div className="space-y-8">
              {collectiveMembers.map((member, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover border-2 border-border"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-accent font-medium mb-4">{member.role}</p>
                      <p className="text-muted-foreground mb-6">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extended Network - Indigo Background */}
      <section className="py-24 px-6 bg-indigo text-indigo-foreground">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-white">Extended Network</h2>
              <p className="text-white/80">Trusted collaborators for specialized work</p>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-8 mb-8">
            <p className="text-lg text-white/90 mb-4">
              No one person can be an expert in everything. When projects demand specialized skills, I work with a curated network of collaborators I've built relationships with over years.
            </p>
            <p className="text-white/80">
              They share the same values: craft over speed, clarity over complexity, outcomes over output.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {collaborators.map((collab, index) => (
              <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white">
                  {collab.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{collab.category}</h3>
                <p className="text-white/80">{collab.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-8 mt-12 text-center">
            <h3 className="text-2xl font-light mb-4 text-white">The Collective Approach</h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              You always work directly with me. When specialists join a project, they become part of a cohesive team, not a hand-off. Quality control, creative direction, and strategic coherence remain consistent throughout.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CollectivePage;
