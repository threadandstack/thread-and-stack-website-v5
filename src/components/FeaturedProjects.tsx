import { useState, useEffect, useRef } from "react";
import ntuk1 from "@/assets/ntuk-logo-new.png";
import ntuk2 from "@/assets/ntuk-quote-new.png";
import ntuk3 from "@/assets/ntuk-olivia.png";
import ntuk4 from "@/assets/ntuk-kieran.png";
import ntuk5 from "@/assets/ntuk-running-new.png";
import { FeaturedProjectModal } from "./FeaturedProjectModal";

const ImageCarousel = ({ images, isVisible }: { images: string[]; isVisible: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3500);

      return () => clearInterval(interval);
    }, 750);

    return () => clearTimeout(delayTimeout);
  }, [images.length, isVisible]);

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
      title: "Nerve Tumours UK",
      role: "Brand Strategy & Digital Transformation",
      description: "Brendan led the client-side aspect of our nationwide rebrand, working with our selected agency partner from start to finish in 2017-18 - redefining how our beneficiaries, supporters and donors relate to our cause",
      fullDescription: "Led the client-side aspect of Nerve Tumours UK's nationwide rebrand from The Neuro Foundation, working with our selected agency partner from start to finish in 2017-18. Thanks to the digital transformation implemented in the three years prior, Nerve Tumours UK had a seamless launch—redefining how beneficiaries, supporters and donors relate to the cause.",
      images: [ntuk1, ntuk2, ntuk3, ntuk4, ntuk5],
      outcomes: [
        "Nationwide rebrand from The Neuro Foundation to Nerve Tumours UK",
        "Seamless digital transformation and launch",
        "Redefined stakeholder relationships across beneficiaries, supporters, and donors",
        "Created sustainable brand and systems foundation"
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
            A transformation story that captures how we work.
          </p>
        </div>

        <div className="flex justify-center">
          {projects.map((project, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedProject(project);
                setModalOpen(true);
              }}
              className="group bg-card rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden text-left w-full max-w-5xl flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/2 flex-shrink-0">
                <ImageCarousel images={project.images} isVisible={isVisible} />
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-5 md:w-1/2">
                <h3 className="text-3xl md:text-4xl font-light not-italic">
                  {project.title}
                </h3>
                
                <p className="text-base text-accent font-light not-italic">
                  {project.role}
                </p>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
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
