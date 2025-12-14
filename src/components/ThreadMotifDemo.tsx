import { useEffect, useRef, useState } from "react";

// Demo component to showcase different thread motif styles inspired by the logo
export const ThreadMotifDemo = () => {
  return (
    <div className="min-h-screen bg-background p-8 space-y-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-4">Thread Motif Options</h1>
        <p className="text-muted-foreground mb-12">
          Inspired by your logo's flowing thread element connecting "Thread" and "Stack"
        </p>

        {/* Option 1: Organic flowing wave - closest to logo */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">1. Organic Flow (Logo-inspired)</h2>
          <p className="text-sm text-muted-foreground">Mirrors the curving, looping thread from your logo</p>
          <div className="relative h-24 bg-muted/20 rounded-lg overflow-visible">
            <OrganicFlowThread />
          </div>
        </section>

        {/* Option 2: Double thread weave */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">2. Double Thread Weave</h2>
          <p className="text-sm text-muted-foreground">Two threads intertwining, echoing the "&" symbol treatment</p>
          <div className="relative h-24 bg-muted/20 rounded-lg overflow-visible">
            <DoubleWeaveThread />
          </div>
        </section>

        {/* Option 3: Looping thread */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">3. Looping Thread</h2>
          <p className="text-sm text-muted-foreground">A single thread with decorative loops, matching the logo's playfulness</p>
          <div className="relative h-24 bg-muted/20 rounded-lg overflow-visible">
            <LoopingThread />
          </div>
        </section>

        {/* Option 4: Minimal wave */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">4. Minimal Wave</h2>
          <p className="text-sm text-muted-foreground">Subtle, refined - lets content breathe</p>
          <div className="relative h-16 bg-muted/20 rounded-lg overflow-visible">
            <MinimalWaveThread />
          </div>
        </section>

        {/* Option 5: Thick brush stroke */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">5. Brush Stroke</h2>
          <p className="text-sm text-muted-foreground">Bolder, more presence - matches logo's confident weight</p>
          <div className="relative h-20 bg-muted/20 rounded-lg overflow-visible">
            <BrushStrokeThread />
          </div>
        </section>

        {/* Color comparison section */}
        <section className="space-y-6 mt-20 pt-12 border-t">
          <h2 className="text-2xl font-medium">Color Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg">Current Site Indigo (HSL 234)</h3>
              <div className="h-32 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'hsl(234, 89%, 50%)' }}>
                <span className="text-white font-medium">HSL 234 89% 50%</span>
              </div>
              <OrganicFlowThread color="hsl(234, 89%, 50%)" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg">Logo Purple (approx HSL 262)</h3>
              <div className="h-32 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'hsl(262, 83%, 50%)' }}>
                <span className="text-white font-medium">HSL 262 83% 50%</span>
              </div>
              <OrganicFlowThread color="hsl(262, 83%, 50%)" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Organic flowing thread - closest to logo aesthetic
const OrganicFlowThread = ({ color = "currentColor" }: { color?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 flex items-center">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 80" 
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        {/* Main flowing thread with loop - inspired by logo */}
        <path
          d="M 0 40 
             C 40 40, 60 20, 100 25 
             C 140 30, 150 55, 180 50 
             C 200 47, 195 30, 210 25 
             C 225 20, 240 35, 230 45 
             C 220 55, 235 60, 260 50 
             C 300 35, 340 45, 400 40"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent transition-all duration-1000"
          style={{
            strokeDasharray: isVisible ? "none" : "1000",
            strokeDashoffset: isVisible ? "0" : "1000",
            opacity: isVisible ? 0.7 : 0,
          }}
        />
      </svg>
    </div>
  );
};

// Double weave thread
const DoubleWeaveThread = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 80" 
        preserveAspectRatio="none"
      >
        {/* First thread */}
        <path
          d="M 0 30 Q 100 60, 200 30 T 400 35"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="text-accent transition-all duration-1000"
          style={{
            opacity: isVisible ? 0.6 : 0,
          }}
        />
        {/* Second thread - offset */}
        <path
          d="M 0 50 Q 100 20, 200 50 T 400 45"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="text-accent transition-all duration-1000 delay-200"
          style={{
            opacity: isVisible ? 0.4 : 0,
          }}
        />
      </svg>
    </div>
  );
};

// Looping thread
const LoopingThread = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 80" 
        preserveAspectRatio="none"
      >
        <path
          d="M 0 40 
             C 30 40, 50 25, 80 30 
             C 95 33, 100 50, 115 55 
             C 130 60, 145 45, 140 35 
             C 135 25, 150 20, 165 25 
             C 180 30, 190 40, 220 40 
             C 260 40, 280 55, 310 50 
             C 340 45, 360 40, 400 40"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent transition-all duration-1000"
          style={{
            strokeDasharray: isVisible ? "none" : "800",
            strokeDashoffset: isVisible ? "0" : "800",
            opacity: isVisible ? 0.6 : 0,
          }}
        />
      </svg>
    </div>
  );
};

// Minimal wave
const MinimalWaveThread = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 50" 
        preserveAspectRatio="none"
      >
        <path
          d="M 0 25 Q 100 15, 200 25 T 400 25"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          className="text-accent/50 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
          }}
        />
      </svg>
    </div>
  );
};

// Brush stroke thread
const BrushStrokeThread = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 60" 
        preserveAspectRatio="none"
      >
        <path
          d="M 0 30 
             C 60 30, 80 15, 140 20 
             C 200 25, 220 45, 280 40 
             C 340 35, 360 30, 400 30"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent transition-all duration-1000"
          style={{
            opacity: isVisible ? 0.5 : 0,
          }}
        />
      </svg>
    </div>
  );
};

export default ThreadMotifDemo;
