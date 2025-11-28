export const Emphasis = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => {
  return (
    <svg 
      viewBox="0 0 200 8" 
      className={`w-full h-2 ${className}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: `draw-line 0.8s ease-out forwards`,
        animationDelay: `${delay}s`,
        strokeDasharray: "200",
        strokeDashoffset: "200"
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