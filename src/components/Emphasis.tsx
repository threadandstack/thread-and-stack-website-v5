export const Emphasis = ({ className = "", delay = 0, animate = true }: { className?: string; delay?: number; animate?: boolean }) => {
  return (
    <svg 
      viewBox="0 0 200 8" 
      className={`w-full h-2 ${className}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: animate ? `draw-line 1s ease-out forwards` : 'none',
        animationDelay: `${delay}ms`,
        strokeDasharray: "200",
        strokeDashoffset: animate ? "200" : "0"
      }}
    >
      <path
        d="M0,4 Q50,2 100,4 T200,4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-accent"
      />
    </svg>
  );
};