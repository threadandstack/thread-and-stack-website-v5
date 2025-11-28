import { useEffect, useState } from "react";

export const VerticalThreadWeave = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / documentHeight, 1);
      setScrollProgress(progress);
      
      // Parallax effect - thread moves slower than page content
      setParallaxOffset(scrolled * 0.3);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate the path length to animate based on scroll
  const pathLength = 6000;
  const visibleLength = pathLength * scrollProgress;

  // Define color stops based on scroll position/sections
  const getThreadColor = (position: number) => {
    if (position < 0.15) return "hsl(var(--accent))"; // Hero/What We Do
    if (position < 0.35) return "#4338ca"; // Who Its For (indigo)
    if (position < 0.55) return "hsl(var(--accent))"; // How We Work
    if (position < 0.75) return "hsl(var(--primary))"; // Projects/Testimonials
    return "hsl(var(--accent))"; // Rest of page
  };

  // Dynamic curve offset based on scroll for animation
  const curveOffset = Math.sin(scrollProgress * Math.PI * 2) * 30;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block"
      style={{ transform: `translateY(-${parallaxOffset}px)` }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 5000"
        preserveAspectRatio="xMidYMin slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="threadGradientDynamic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={getThreadColor(0)} stopOpacity="0.7" />
            <stop offset="15%" stopColor={getThreadColor(0.15)} stopOpacity="0.6" />
            <stop offset="35%" stopColor={getThreadColor(0.35)} stopOpacity="0.6" />
            <stop offset="55%" stopColor={getThreadColor(0.55)} stopOpacity="0.6" />
            <stop offset="75%" stopColor={getThreadColor(0.75)} stopOpacity="0.6" />
            <stop offset="100%" stopColor={getThreadColor(1)} stopOpacity="0.5" />
          </linearGradient>
          
          {/* Glow filter for section intersections */}
          <filter id="sectionGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main thread path with dramatic curves and dynamic animation */}
        <path
          d={`M 120 0 
             Q ${60 + curveOffset} 150, ${140 - curveOffset} 350
             Q ${220 + curveOffset} 550, ${100 - curveOffset} 750
             Q ${-20 + curveOffset} 950, ${140 - curveOffset} 1150
             Q ${300 + curveOffset} 1350, ${160 - curveOffset} 1550
             Q ${20 + curveOffset} 1750, ${200 - curveOffset} 1950
             Q ${380 + curveOffset} 2150, ${600 - curveOffset} 2300
             Q ${820 + curveOffset} 2450, ${1100 - curveOffset} 2600
             Q ${1380 + curveOffset} 2750, ${1300 - curveOffset} 2950
             Q ${1220 + curveOffset} 3150, ${1340 - curveOffset} 3350
             Q ${1460 + curveOffset} 3550, ${1280 - curveOffset} 3750
             Q ${1100 + curveOffset} 3950, ${1300 - curveOffset} 4150
             Q ${1500 + curveOffset} 4350, ${1340 - curveOffset} 4550
             Q ${1180 + curveOffset} 4750, ${1300 - curveOffset} 4900
             L 1300 5000`}
          stroke="url(#threadGradientDynamic)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength - visibleLength}
          className="transition-all duration-100 ease-out"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.1))'
          }}
        />
        
        {/* Section intersection highlights - Hero/What We Do */}
        {scrollProgress > 0.05 && scrollProgress < 0.2 && (
          <circle 
            cx={100} 
            cy={500} 
            r="8" 
            fill={getThreadColor(0.1)} 
            opacity="0.8"
            filter="url(#sectionGlow)"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* Who Its For section intersection */}
        {scrollProgress > 0.2 && scrollProgress < 0.4 && (
          <circle 
            cx={140} 
            cy={1150} 
            r="8" 
            fill={getThreadColor(0.3)} 
            opacity="0.8"
            filter="url(#sectionGlow)"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* How We Work section intersection */}
        {scrollProgress > 0.35 && scrollProgress < 0.55 && (
          <circle 
            cx={160} 
            cy={1750} 
            r="8" 
            fill={getThreadColor(0.45)} 
            opacity="0.8"
            filter="url(#sectionGlow)"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* Offers/Projects section intersection */}
        {scrollProgress > 0.5 && scrollProgress < 0.7 && (
          <circle 
            cx={1100} 
            cy={2600} 
            r="8" 
            fill={getThreadColor(0.6)} 
            opacity="0.8"
            filter="url(#sectionGlow)"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* About/Contact section intersection */}
        {scrollProgress > 0.7 && scrollProgress < 0.9 && (
          <circle 
            cx={1280} 
            cy={3750} 
            r="8" 
            fill={getThreadColor(0.8)} 
            opacity="0.8"
            filter="url(#sectionGlow)"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
    </div>
  );
};
