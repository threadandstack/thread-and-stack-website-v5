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
  const pathLength = 5000; // Total path length
  const visibleLength = pathLength * scrollProgress;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 5000"
        preserveAspectRatio="xMidYMin slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="threadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Main thread path that weaves down the page */}
        <path
          d="M 80 0 
             Q 60 200, 80 400 
             Q 100 600, 80 800 
             Q 60 1000, 80 1200 
             Q 100 1400, 80 1600
             Q 60 1800, 100 2000
             Q 140 2200, 200 2400
             Q 300 2600, 500 2800
             Q 800 3000, 1200 3200
             Q 1300 3400, 1320 3600
             Q 1340 3800, 1320 4000
             Q 1300 4200, 1320 4400
             Q 1340 4600, 1320 4800
             L 1320 5000"
          stroke="url(#threadGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength - visibleLength}
          className="transition-all duration-100 ease-out"
        />
        
        {/* Decorative dots along the thread at key points */}
        {scrollProgress > 0.2 && (
          <circle cx="80" cy="800" r="4" fill="hsl(var(--accent))" opacity="0.5">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {scrollProgress > 0.4 && (
          <circle cx="80" cy="1600" r="4" fill="hsl(var(--accent))" opacity="0.5">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {scrollProgress > 0.6 && (
          <circle cx="500" cy="2800" r="4" fill="hsl(var(--accent))" opacity="0.5">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {scrollProgress > 0.8 && (
          <circle cx="1320" cy="4000" r="4" fill="hsl(var(--accent))" opacity="0.5">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
    </div>
  );
};
