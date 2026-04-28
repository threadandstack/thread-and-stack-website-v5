import { useState, useEffect } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { z } from "zod";
import { trackContactFormSubmit } from "@/hooks/useAnalytics";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  role_org: z.string().trim().max(150).optional(),
  message: z.string().trim().max(2000).optional(),
});

interface MasterclassRegisterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "register" | "question";
  source?: string;
}

const readUtm = () => {
  if (typeof window === "undefined") return { utm_source: null, utm_medium: null, utm_campaign: null };
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
  };
};

export const MasterclassRegisterDrawer = ({
  open,
  onOpenChange,
  mode = "register",
  source = "notion-masterclass",
}: MasterclassRegisterDrawerProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleOrg, setRoleOrg] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setName("");
        setEmail("");
        setRoleOrg("");
        setMessage("");
        setConsent(false);
      }, 300);
    }
  }, [open]);

  const isQuestion = mode === "question";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — bot detected
    if (honeypot) return;

    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please confirm you're happy to be contacted about the masterclass.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const validation = registerSchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      role_org: roleOrg.trim() || undefined,
      message: message.trim() || undefined,
    });

    if (!validation.success) {
      toast({
        title: "Please check your details",
        description: validation.error.errors[0]?.message || "Some fields need attention.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const utm = readUtm();

    try {
      const { error } = await supabase.from("masterclass_registrations").insert({
        name: validation.data.name,
        email: validation.data.email,
        role_org: validation.data.role_org ?? null,
        message: validation.data.message ?? null,
        mode,
        consent_given: consent,
        ...utm,
      });

      if (error) throw error;

      trackContactFormSubmit(`${source}-${mode}`);

      // Mirror to general leads pipeline + Notion (best-effort)
      const noteParts = [
        roleOrg.trim() ? `[${roleOrg.trim()}]` : "",
        `[Notion Masterclass — ${mode}]`,
        message.trim(),
      ].filter(Boolean);
      const fullMessage = noteParts.join("\n\n");

      supabase.functions
        .invoke("sync-lead-to-notion", {
          body: {
            name: validation.data.name,
            email: validation.data.email,
            message: fullMessage || null,
            source: `notion-masterclass-${mode}`,
          },
        })
        .catch((err) => console.error("Notion sync error:", err));

      toast({
        title: isQuestion ? "Question received" : "You're on the list",
        description: isQuestion
          ? "I'll get back to you shortly."
          : "Look out for an email with details about the next cohort.",
      });

      onOpenChange(false);
    } catch (err: any) {
      console.error("Masterclass registration error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or email me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif-pro text-3xl italic font-semibold">
            {isQuestion ? "Ask a question" : "Save your seat"}
          </SheetTitle>
        </SheetHeader>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {isQuestion
            ? "Wondering if the masterclass is right for you? Send a quick note and I'll come back personally."
            : "Drop your details and I'll send you joining instructions plus the workspace template before the session."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mc-name" className="text-sm text-muted-foreground">
              Name *
            </Label>
            <Input
              id="mc-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background rounded-lg mt-1"
            />
          </div>

          <div>
            <Label htmlFor="mc-email" className="text-sm text-muted-foreground">
              Email *
            </Label>
            <Input
              id="mc-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background rounded-lg mt-1"
            />
          </div>

          <div>
            <Label htmlFor="mc-role" className="text-sm text-muted-foreground">
              Role / Organisation
            </Label>
            <Input
              id="mc-role"
              type="text"
              placeholder="Founder at..."
              value={roleOrg}
              onChange={(e) => setRoleOrg(e.target.value)}
              className="bg-background rounded-lg mt-1"
            />
          </div>

          <div>
            <Label htmlFor="mc-message" className="text-sm text-muted-foreground">
              {isQuestion
                ? "Your question"
                : "What's your biggest Notion frustration right now?"}
            </Label>
            <Textarea
              id="mc-message"
              placeholder={
                isQuestion
                  ? "Ask away..."
                  : "Tell me what's tangled up — I'll tailor the session examples."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-background rounded-lg mt-1 min-h-[120px]"
            />
          </div>

          {/* GDPR consent */}
          <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border accent-accent"
            />
            <span>
              I'm happy for Brendan to email me about the Notion Masterclass and related
              updates. I can unsubscribe any time.
            </span>
          </label>

          {/* Honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <Input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <PillButton type="submit" disabled={isSubmitting} className="w-full" icon={Send}>
            {isSubmitting
              ? "Sending..."
              : isQuestion
              ? "Send question"
              : "Save my seat"}
          </PillButton>
        </form>
      </SheetContent>
    </Sheet>
  );
};
