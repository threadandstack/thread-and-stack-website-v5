import { useState } from "react";
import graffitiWalk from "@/assets/brendan-graffiti-walk.jpg";
import graffitiPortrait from "@/assets/brendan-graffiti-portrait.jpg";
import deskCelebration from "@/assets/brendan-desk-celebration.jpg";
import ntukDigital from "@/assets/ntuk-digital.png";
import { FeaturedProjectModal } from "./FeaturedProjectModal";

export const FeaturedProjects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const projects = [
    {
      title: "eBay",
      role: "Content Strategy & Creative Consulting",
      description: "Built trust among stakeholders and boosted marketing efficiency through creative strategy",
      fullDescription: "Working with eBay's marketing team, I developed content strategy frameworks that built trust among internal stakeholders while significantly boosting marketing efficiency. The work focused on creating clear creative direction and streamlining content workflows across multiple teams and markets.",
      image: graffitiWalk,
      outcomes: [
        "Established unified content strategy framework across teams",
        "Improved stakeholder alignment and decision-making speed",
        "Increased marketing efficiency through clearer creative briefs",
        "Reduced creative tax for marketing teams"
      ]
    },
    {
      title: "Fundraising Everywhere",
      role: "Marketing Strategy & AI Integration",
      description: "Transformed marketing operations with AI workflows, achieving more progress in 2 months than the previous year",
      fullDescription: "Partnered with Fundraising Everywhere to transform their marketing operations through strategic AI integration. By building custom workflows tailored to their tools and ethics, we achieved more progress in 2 months than they had in the previous year—without sacrificing brand voice or creative control.",
      image: deskCelebration,
      outcomes: [
        "2 months of progress = previous year's output",
        "Custom AI workflows integrated with existing tools",
        "Maintained authentic brand voice throughout",
        "Reduced cognitive load for marketing team",
        "Established sustainable content systems"
      ]
    },
    {
      title: "Nerve Tumours UK",
      role: "Brand Strategy & Digital Transformation",
      description: "Brendan led the client-side aspect of our nationwide rebrand, working with our selected agency partner from start to finish in 2017-18 - redefining how our beneficiaries, supporters and donors relate to our cause",
      fullDescription: "Led the client-side aspect of Nerve Tumours UK's nationwide rebrand from The Neuro Foundation, working with our selected agency partner from start to finish in 2017-18. Thanks to the digital transformation implemented in the three years prior, Nerve Tumours UK had a seamless launch—redefining how beneficiaries, supporters and donors relate to the cause.",
      image: ntukDigital,
      outcomes: [
        "Nationwide rebrand from The Neuro Foundation to Nerve Tumours UK",
        "Seamless digital transformation and launch",
        "Redefined stakeholder relationships across beneficiaries, supporters, and donors",
        "Created sustainable brand and systems foundation"
      ]
    },
    {
      title: "Funraisin",
      role: "Brand & Systems Consulting",
      description: "Fast action planning with exceptional follow-through on brand cohesion and operational systems",
      fullDescription: "Provided strategic consulting to Funraisin focused on brand cohesion and operational systems. The work emphasized fast action planning combined with exceptional follow-through, helping the team maintain brand integrity while scaling their platform and operations.",
      image: graffitiPortrait,
      outcomes: [
        "Rapid strategic action planning",
        "Improved brand cohesion across touchpoints",
        "Streamlined operational systems",
        "Maintained clarity during growth phase"
      ]
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
            <button
              key={index}
              onClick={() => {
                setSelectedProject(project);
                setModalOpen(true);
              }}
              className="group bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden text-left w-full"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-light not-italic">
                  {project.title}
                </h3>
                
                <p className="text-sm text-accent font-light not-italic">
                  {project.role}
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                
                <p className="text-sm text-accent font-light not-italic">
                  Click to learn more →
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <FeaturedProjectModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};
