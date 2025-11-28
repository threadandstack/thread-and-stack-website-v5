export const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-primary text-primary-foreground border-t-2 thread-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl mb-2 font-light">Thread & Stack</h3>
            <p className="text-primary-foreground/80 text-sm">
              Grow not just faster, but truer.
            </p>
          </div>
          
          <div>
            <h4 className="mb-3 font-light not-italic">Offers</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="/stacked-sessions" className="hover:text-primary-foreground transition-colors">Stacked Sessions</a></li>
              <li><a href="/mentorship-sprint" className="hover:text-primary-foreground transition-colors">Mentorship Sprint</a></li>
              <li><a href="/workshops" className="hover:text-primary-foreground transition-colors">Workshops</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 font-light not-italic">Connect</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#contact" className="hover:text-primary-foreground transition-colors">Get in Touch</a></li>
              <li><a href="#how-we-work" className="hover:text-primary-foreground transition-colors">How We Work</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t thread-border pt-8 text-center text-sm text-primary-foreground/60">
          <p className="not-italic">© {new Date().getFullYear()} Thread & Stack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
