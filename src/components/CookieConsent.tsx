import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadGTM } from "@/lib/gtm";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    } else if (stored === "accepted") {
      loadGTM();
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    loadGTM();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-lg p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          We use cookies to analyse site traffic and improve your experience.{" "}
          <Link to="/privacy" className="underline text-foreground hover:text-primary">
            Privacy Policy
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={decline}>
            Decline
          </Button>
          <Button size="sm" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};
