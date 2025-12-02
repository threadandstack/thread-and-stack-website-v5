export const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-primary text-primary-foreground border-t border-border/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl mb-2 font-light">Thread & Stack</h3>
            <p className="text-primary-foreground/80 text-sm">
              Marketing that feels more human.
            </p>
          </div>
          
          <div>
            <h4 className="mb-3 font-light not-italic">Offers</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="/sessions-and-sprints" className="hover:text-primary-foreground transition-colors">Sessions & Sprints</a></li>
              <li><a href="/workshops" className="hover:text-primary-foreground transition-colors">Brand Connection Workshops</a></li>
              <li><a href="/fractional-deep-engagement" className="hover:text-primary-foreground transition-colors">Fractional & Deep Engagement</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 font-light not-italic">Connect</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="/blog" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#contact" className="hover:text-primary-foreground transition-colors">Get in Touch</a></li>
              <li><a href="#how-we-work" className="hover:text-primary-foreground transition-colors">How We Work</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p className="not-italic">© {new Date().getFullYear()} Thread & Stack. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="/data-guarantee" className="hover:text-primary-foreground transition-colors">Data Guarantee</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
