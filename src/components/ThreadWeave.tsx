export const ThreadWeave = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative h-24 overflow-visible ${className}`}>
      <svg 
        className="absolute left-0 w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <path
          d="M 10 0 Q 30 25, 50 50 T 90 100"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-accent/30"
          strokeLinecap="round"
        />
        <path
          d="M 10 0 Q 30 25, 50 50 T 90 100"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-accent/60"
          strokeLinecap="round"
          strokeDasharray="2 8"
        />
      </svg>
    </div>
  );
};
