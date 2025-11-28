export const Emphasis = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 200 8" 
      className={`w-full h-2 ${className}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
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