import { useEffect, useRef, useState } from "react";

export const ThreadWeave = ({ className = "" }: { className?: string }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative h-32 overflow-visible ${className}`}>
      <svg 
        className="absolute left-0 w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <path
          ref={pathRef}
          d="M 0 50 Q 25 30, 50 50 T 100 50"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          className="text-accent/40 transition-all duration-1000"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: isVisible ? "none" : "1000",
            strokeDashoffset: isVisible ? "0" : "1000",
            opacity: isVisible ? 1 : 0,
          }}
        />
      </svg>
    </div>
  );
};
