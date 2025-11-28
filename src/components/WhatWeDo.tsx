import thinkingImage from "@/assets/brendan-cafe.jpeg";

export const WhatWeDo = () => {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-8">
            <h2 className="text-5xl md:text-6xl mb-12 text-balance font-light leading-tight">
              Clear narratives.<br />Practical workflows.<br />Living brands.
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl leading-relaxed border-l-4 border-accent/20 pl-8">
              <p className="text-2xl font-light not-italic">
                I help purpose-led teams close the gap between what they mean and what they're actually saying and shipping.
              </p>
              
              <p>
                That means sharper positioning, honest messaging, and practical systems that reduce "creative tax"—the admin, chaos, and context switching that drags you away from meaningful work.
              </p>
              
              <p>
                Together we build workflows that protect creative energy and brand integrity. Your brand becomes a decision filter, not just a logo. AI becomes your co-pilot, not a replacement for judgment.
              </p>
              
              <p className="not-italic font-light">
                You get time back. Your team stays aligned. Your brand shows up consistently.
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
