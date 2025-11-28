import thinkingImage from "@/assets/brendan-cafe.jpeg";

export const WhatWeDo = () => {
  return (
    <section className="py-24 px-6 bg-card border-b-2 thread-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-8">
            <h2 className="text-4xl md:text-5xl mb-8 text-balance font-light">
              What Thread & Stack does
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed border-l-2 thread-border pl-8">
              <p>
                I work with purpose‑led founders and teams to build brands and systems that scale without losing their soul.
              </p>
              
              <p>
                That means clearer positioning, stronger messaging, and practical workflows (Notion, AI, human judgment) that reduce what I call "creative tax"—the admin, chaos, and context switching that drags you away from the good work.
              </p>
              
              <p>
                Together we design systems that make the good work easier to do, and easier to repeat. You get time back. Your brand becomes a decision filter, not just a logo. And AI becomes your co‑pilot, not a replacement for your taste.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <img 
              src={thinkingImage} 
              alt="Strategic thinking"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
