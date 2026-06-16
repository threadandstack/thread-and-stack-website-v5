import { Linkedin, Mail } from "lucide-react";
import { trackFooterLinkClick } from "@/hooks/useAnalytics";
import whiteStackedLogo from "@/assets/logos/White_TS_Stacked.svg";
import blackStackedLogo from "@/assets/logos/Black_TS_Stacked.svg";

const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 568 501" className={className} fill="currentColor">
    <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.163 284.017 371.372 284 374.799C283.983 371.372 282.831 375.163 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z"/>
  </svg>
);

const SubstackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24l9.54-5.503 9.54 5.503V10.812H1.46zm0-8.242h21.08V0H1.46v2.57z"/>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-black text-white dark:bg-white dark:text-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <img src={whiteStackedLogo} alt="Thread & Stack" className="h-14 mb-3 dark:hidden" />
            <img src={blackStackedLogo} alt="Thread & Stack" className="h-14 mb-3 hidden dark:block" />
            <p className="font-sans text-white/80 dark:text-black/80 text-sm">
              Ops that feel human, systems that make sense.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold italic">Connect</h4>
            <ul className="space-y-2 text-sm font-sans text-white/80 dark:text-black/80">
              <li><a href="#contact" className="hover:text-white dark:hover:text-black transition-colors" onClick={() => trackFooterLinkClick('Get in Touch', 'internal')}>Get in Touch</a></li>
              <li><a href="https://www.linkedin.com/in/rodgersbrendan/" target="_blank" rel="noopener noreferrer" className="hover:text-white dark:hover:text-black transition-colors flex items-center gap-2" onClick={() => trackFooterLinkClick('LinkedIn', 'social')}><Linkedin className="h-4 w-4" />LinkedIn</a></li>
              <li><a href="https://bsky.app/profile/threadandstack.com" target="_blank" rel="noopener noreferrer" className="hover:text-white dark:hover:text-black transition-colors flex items-center gap-2" onClick={() => trackFooterLinkClick('Bluesky', 'social')}><BlueskyIcon className="h-4 w-4" />Bluesky</a></li>
              <li><a href="https://stackedbehaviours.substack.com/?utm_campaign=website" target="_blank" rel="noopener noreferrer" className="hover:text-white dark:hover:text-black transition-colors flex items-center gap-2" onClick={() => trackFooterLinkClick('Substack', 'social')}><SubstackIcon className="h-4 w-4" />Substack</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 dark:border-black/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-sans text-white/60 dark:text-black/60">
          <p className="not-italic">&copy; {new Date().getFullYear()} Thread & Stack. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white dark:hover:text-black transition-colors" onClick={() => trackFooterLinkClick('Privacy Policy', 'legal')}>Privacy Policy</a>
            <a href="/data-guarantee" className="hover:text-white dark:hover:text-black transition-colors" onClick={() => trackFooterLinkClick('Data Guarantee', 'legal')}>Data Guarantee</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
