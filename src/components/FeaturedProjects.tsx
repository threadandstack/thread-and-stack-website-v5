import { useState, useEffect, useRef } from "react";
import ntuk1 from "@/assets/ntuk-logo-new.png";
import ntuk2 from "@/assets/ntuk-quote-new.png";
import ntuk3 from "@/assets/ntuk-olivia.png";
import ntuk4 from "@/assets/ntuk-kieran.png";
import ntuk5 from "@/assets/ntuk-running-new.png";
import { FeaturedProjectModal } from "./FeaturedProjectModal";
import { trackCaseStudyView } from "@/hooks/useAnalytics";

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
    <div className="aspect-square overflow-hidden relative w-full block">
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
      description: "I was delighted to be part of the Nerve Tumours UK rebrand and worked with their chosen agency partner as their in-house brand lead. We transformed the way that their beneficiaries perceived neurofibromatosis, NF1, NF2 and SWN. It required a bold approach from all the collaborators involved.",
      fullDescription: "26,000 people in the UK live with a form of neurofibromatosis, yet few realised that much of the support they received through the NHS was sustained by The Neuro Foundation. The organisation needed a clearer name, identity, and story to centre beneficiaries and strengthen its mission.\n\nAs the in-house brand lead, I worked closely with their chosen agency partner, the board of trustees, the CEO, medical specialists, and supporters. My role was to guide the creative and strategic direction, ensure beneficiary needs were properly represented, and shape a brand that reflected both the seriousness of the condition and the organisation's commitment to supporting adults and young people with nerve tumour related conditions.\n\nBy championing beneficiary-first messaging, I helped bring forward the real experiences of people who had long been hidden behind the complexity of the condition. Navigating those stories required sensitivity and trust, and doing so allowed the charity to articulate its case more clearly to funding bodies, supporters, and public audiences. This work laid the foundation for a brand that felt honest, human, and grounded in both lived experience and medical expertise.",
      quote: "Brendan led the client-side aspect of our nationwide rebrand, working with our selected agency partner from start to finish in 2017-18. Thanks to him, 'The Neuro Foundation' became 'Nerve Tumours UK' and the digital transformation that he and his team implemented with me during the three years prior, Nerve Tumours UK had a seamless launch - redefining how our beneficiaries, supporters and donors relate to our cause.",
      quoteAttribution: "Karen Cockburn, CEO, Nerve Tumours UK",
      images: [ntuk1, ntuk2, ntuk3, ntuk4, ntuk5],
      creativeDirection: "We set a bold and visible creative direction built on warmth, while still keeping enough medical cues to feel trustworthy. The old palette shifted from murky greens to an overly clinical NHS look, which did not serve the brand. We shaped something more natural, playful, and confident. A brand that could sit comfortably in the daily lives of beneficiaries, feel energising for fundraisers, and still act as a steady, supportive guide for those who needed clarity and reassurance.",
      visualSystem: "We used colour theory with intention and designed a visual system shaped around real user behaviour. This included email design, website journeys, and the fundraising hub. We also considered how the brand would show up in fast-moving digital spaces. Platforms like Pinterest informed our approach to modular layouts, flexible components, and content that would translate well across social media.",
      designLeadership: "The name The Neuro Foundation created confusion and consistently misaligned expectations. Many people assumed the organisation was a brain charity. Beneficiaries were also hiding behind the complexity of the word neurofibromatosis. Bringing the reality of nerve tumours to the forefront was a clear and confident decision. It gave people language they could understand, anchored the brand in truth, and matched the direction we knew the organisation needed.",
      outcomes: [
        "Holistic identity and strategy refresh including new name and culture",
        "Charity-wide asset refresh: medical guides, fundraising materials, merchandise, stationery, donor journeys, websites",
        "Beneficiary-first narrative and messaging",
        "Transformed perceptions of neurofibromatosis (NF1, NF2 and SWN)"
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
                trackCaseStudyView(project.title);
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
