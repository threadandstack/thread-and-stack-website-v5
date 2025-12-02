import { Linkedin } from "lucide-react";

const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 568 501" className={className} fill="currentColor">
    <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.163 284.017 371.372 284 374.799C283.983 371.372 282.831 375.163 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z"/>
  </svg>
);

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
              <li><a href="https://www.linkedin.com/in/rodgersbrendan/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors flex items-center gap-2"><Linkedin className="h-4 w-4" />LinkedIn</a></li>
              <li><a href="https://bsky.app/profile/threadandstack.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors flex items-center gap-2"><BlueskyIcon className="h-4 w-4" />Bluesky</a></li>
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
