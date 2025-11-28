import { useEffect, useState } from "react";

export const VerticalThreadWeave = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / documentHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate the path length to animate based on scroll
  const pathLength = 5000;
  const visibleLength = pathLength * scrollProgress;

  // Define color stops based on scroll position/sections
  const getThreadColor = (position: number) => {
    if (position < 0.15) return "hsl(var(--accent))"; // Hero/What We Do
    if (position < 0.35) return "#4338ca"; // Who Its For (indigo)
    if (position < 0.55) return "hsl(var(--accent))"; // How We Work
    if (position < 0.75) return "hsl(var(--primary))"; // Projects/Testimonials
    return "hsl(var(--accent))"; // Rest of page
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block">
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
        </defs>
        
        {/* Main thread path with dramatic curves and weaving */}
        <path
          d="M 120 0 
             Q 60 150, 140 350
             Q 220 550, 100 750
             Q -20 950, 140 1150
             Q 300 1350, 160 1550
             Q 20 1750, 200 1950
             Q 380 2150, 600 2300
             Q 820 2450, 1100 2600
             Q 1380 2750, 1300 2950
             Q 1220 3150, 1340 3350
             Q 1460 3550, 1280 3750
             Q 1100 3950, 1300 4150
             Q 1500 4350, 1340 4550
             Q 1180 4750, 1300 4900
             L 1300 5000"
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
        
        {/* Decorative dots along the thread at key weaving points */}
        {scrollProgress > 0.15 && (
          <circle cx="140" cy="750" r="5" fill={getThreadColor(0.15)} opacity="0.6">
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {scrollProgress > 0.35 && (
          <circle cx="160" cy="1550" r="5" fill={getThreadColor(0.35)} opacity="0.6">
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2.5s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {scrollProgress > 0.55 && (
          <circle cx="1100" cy="2600" r="5" fill={getThreadColor(0.55)} opacity="0.6">
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2.5s"
              begin="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {scrollProgress > 0.75 && (
          <circle cx="1300" cy="4150" r="5" fill={getThreadColor(0.75)} opacity="0.6">
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2.5s"
              begin="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
    </div>
  );
};
