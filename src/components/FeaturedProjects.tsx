import { ExternalLink } from "lucide-react";
import graffitiWalk from "@/assets/brendan-graffiti-walk.jpg";
import graffitiPortrait from "@/assets/brendan-graffiti-portrait.jpg";
import deskCelebration from "@/assets/brendan-desk-celebration.jpg";
import ntukDigital from "@/assets/ntuk-digital.png";

export const FeaturedProjects = () => {
  const projects = [
    {
      title: "eBay",
      role: "Content Strategy & Creative Consulting",
      description: "Built trust among stakeholders and boosted marketing efficiency through creative strategy",
      image: graffitiWalk,
      link: "https://pages.threadandstack.com/portfolio?pvs=74"
    },
    {
      title: "Fundraising Everywhere",
      role: "Marketing Strategy & AI Integration",
      description: "Transformed marketing operations with AI workflows, achieving more progress in 2 months than the previous year",
      image: deskCelebration,
      link: "https://pages.threadandstack.com/portfolio?pvs=74"
    },
    {
      title: "Nerve Tumours UK",
      role: "Brand Strategy & Digital Transformation",
      description: "Brendan led the client-side aspect of our nationwide rebrand, working with our selected agency partner from start to finish in 2017-18 - redefining how our beneficiaries, supporters and donors relate to our cause",
      image: ntukDigital,
      link: "https://pages.threadandstack.com/portfolio?pvs=74"
    },
    {
      title: "Funraisin",
      role: "Brand & Systems Consulting",
      description: "Fast action planning with exceptional follow-through on brand cohesion and operational systems",
      image: graffitiPortrait,
      link: "https://pages.threadandstack.com/portfolio?pvs=74"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl mb-4 text-balance font-light">
            Featured Work
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real brands, real transformations. See how we've helped teams grow truer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-light not-italic">
                    {project.title}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <p className="text-sm text-accent font-light not-italic">
                  {project.role}
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
