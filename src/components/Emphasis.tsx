export const Emphasis = ({ className = "", delay = 0, animate = true }: { className?: string; delay?: number; animate?: boolean }) => {
  return (
    <svg 
      viewBox="0 0 200 14" 
      className={`w-full h-3 ${className}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: animate ? `draw-line 1s ease-out forwards` : 'none',
        animationDelay: `${delay}ms`,
        strokeDasharray: "300",
        strokeDashoffset: animate ? "300" : "0"
      }}
    >
      <path
        d="M0,7 C12,4 25,10 38,6 C52,2 65,9 78,5 C92,1 105,8 118,4 C132,0 145,7 158,5 C172,3 185,8 200,6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="text-accent"
      />
    </svg>
  );
};