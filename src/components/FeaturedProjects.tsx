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
      fullDescription: "26,000 people in the UK live with a form of Neurofibromatosis, yet few realised the support they received via the NHS was often funded by The Neuro Foundation. The charity needed a clearer name, identity, and story to centre beneficiaries and sharpen mission clarity. Working as their in-house brand lead alongside their chosen agency partner, we delivered a holistic transformation that put beneficiaries first.\n\nI sat on the brand committee with the board of trustees and the CEO to impart how serious the cause is while also rooting it in its medical expertise and confident intent to support adults and young people with nerve tumour-related conditions.\n\nBy embracing beneficiary-first messaging, we told the story of real people and brought people to the heart of a non-profit that struggled to get these stories due to the vulnerable nature of those people experiencing the diagnosis. And by navigating that delicate relationship with brave and courageous individuals, the charity was able to articulate its case to funding bodies, supporters, and public audiences alike.",
      quote: "Brendan led the client-side aspect of our nationwide rebrand, working with our selected agency partner from start to finish in 2017-18. Thanks to him, 'The Neuro Foundation' became 'Nerve Tumours UK' and the digital transformation that he and his team implemented with me during the three years prior, Nerve Tumours UK had a seamless launch - redefining how our beneficiaries, supporters and donors relate to our cause.",
      quoteAttribution: "Karen Cockburn, CEO, Nerve Tumours UK",
      images: [ntuk1, ntuk2, ntuk3, ntuk4, ntuk5],
      creativeDirection: "We established bold, visible, and creative direction rooted in warmth but didn't move too far away from medical visual cues. Previous brand colours had involved murky greens, then flipped too far toward NHS color schemes. We were looking for a more natural, yet bold, playful, and authoritative brand that could live in the lives of our beneficiaries while being fun for our fundraisers, but being a guiding hand for those that needed us.",
      visualSystem: "We leaned on colour theory and paid close attention to customer experience and user journeys for email design, website design, and fundraising hub. We took inspiration from websites like Pinterest and paid attention to what the content would look like in social media.",
      designLeadership: "We knew The Neuro Foundation was not a name doing our beneficiaries any good. It was confusing and causing misalignment—people often thought we were a brain charity. Our beneficiaries often hid behind the complexity of 'neurofibromatosis,' and bringing the reality of nerve tumours to the forefront was a bold move that matched the vision we had for the brand.",
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
