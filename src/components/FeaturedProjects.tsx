import { useState, useEffect, useRef } from "react";
import ubiq1 from "@/assets/ubiq-project.png";
import ubiq2 from "@/assets/ubiq-1.png";
import ubiq3 from "@/assets/ubiq-2.png";
import ubiq4 from "@/assets/ubiq-3.png";
import ntuk1 from "@/assets/ntuk-logo.png";
import ntuk2 from "@/assets/ntuk-digital-2.png";
import ntuk3 from "@/assets/ntuk-digital-3.png";
import ntuk4 from "@/assets/ntuk-running.png";
import imma1 from "@/assets/imma-project.png";
import imma2 from "@/assets/imma-1.png";
import imma3 from "@/assets/imma-2.png";
import imma4 from "@/assets/imma-3.png";
import { FeaturedProjectModal } from "./FeaturedProjectModal";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="aspect-[4/3] overflow-hidden relative w-full block">
      <div 
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt=""
            className="min-w-full h-full object-cover flex-shrink-0 block"
          />
        ))}
      </div>
    </div>
  );
};

export const FeaturedProjects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: "UBIQ",
      role: "Marketing Strategy & AI Integration",
      description: "Transformed marketing operations with AI workflows, achieving more progress in 2 months than the previous year",
      fullDescription: "Partnered with UBIQ to transform their marketing operations through strategic AI integration. By building custom workflows tailored to their tools and ethics, we achieved more progress in 2 months than they had in the previous year—without sacrificing brand voice or creative control.",
      images: [ubiq1, ubiq3, ubiq2, ubiq4],
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
      images: [ntuk1, ntuk2, ntuk3, ntuk4],
      outcomes: [
        "Nationwide rebrand from The Neuro Foundation to Nerve Tumours UK",
        "Seamless digital transformation and launch",
        "Redefined stakeholder relationships across beneficiaries, supporters, and donors",
        "Created sustainable brand and systems foundation"
      ]
    },
    {
      title: "IMMA Collective",
      role: "Brand Strategy & Community Building",
      description: "Building cohesive brand identity and community systems for emerging creative collective",
      fullDescription: "Worked with IMMA Collective to establish their brand foundation and community engagement systems. The project focused on creating clarity around their mission while building practical workflows that support their growing creative community.",
      images: [imma1, imma2, imma3, imma4],
      outcomes: [
        "Established clear brand identity and positioning",
        "Created sustainable community engagement systems",
        "Built frameworks for consistent communication",
        "Maintained authenticity while scaling"
      ]
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
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
              className="group bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden text-left w-full flex flex-col"
            >
              <div className="w-full">
                <ImageCarousel images={project.images} />
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
