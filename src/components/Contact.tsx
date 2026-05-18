import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import contactPhoto from "@/assets/photos/shoreditch/brendan-29.webp";

const contactSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  role: z.string().max(100, "Role must be less than 100 characters").optional(),
  message: z.string().max(5000, "Message must be less than 5000 characters").optional(),
});

export const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      return;
    }
    
    setIsSubmitting(true);

    const validation = contactSchema.safeParse({
      name: name.trim() || undefined,
      email: email.trim(),
      role: role.trim() || undefined,
      message: message.trim() || undefined,
    });

    if (!validation.success) {
      toast({
        title: "Validation error",
        description: validation.error.errors[0]?.message || "Please check your input",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    const fullMessage = role.trim() 
      ? `[${role.trim()}]\n\n${message.trim()}` 
      : message.trim();

    try {
      const leadId = crypto.randomUUID();
      const source = 'homepage-contact';
      const cleanName = name.trim() || null;
      const cleanEmail = email.trim();

      const { error } = await supabase
        .from('leads')
        .insert({
          id: leadId,
          name: cleanName,
          email: cleanEmail,
          message: fullMessage || null,
          source
        });

      if (error) throw error;

      supabase.functions.invoke('sync-lead-to-notion', {
        body: {
          name: cleanName,
          email: cleanEmail,
          message: fullMessage || null,
          source
        }
      }).catch(err => console.error('Notion sync error:', err));

      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'lead-visitor-confirmation',
          recipientEmail: cleanEmail,
          idempotencyKey: `lead-visitor-${leadId}`,
          templateData: { name: cleanName ?? undefined },
        }
      }).catch(err => console.error('Visitor email error:', err));

      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'lead-admin-notification',
          idempotencyKey: `lead-admin-${leadId}`,
          templateData: {
            name: cleanName ?? undefined,
            email: cleanEmail,
            source,
            message: fullMessage || undefined,
            submittedAt: new Date().toISOString(),
          },
        }
      }).catch(err => console.error('Admin email error:', err));

      toast({
        title: "Message sent!",
        description: "I'll be in touch soon."
      });
      
      setName("");
      setEmail("");
      setRole("");
      setMessage("");
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or email me directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'}`}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-5xl md:text-6xl font-semibold italic">
            Let's talk
          </h2>
          <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed">
            Tell me what you're wrestling with. No pressure, just conversation.
          </p>
          <img 
            src={contactPhoto} 
            alt="Brendan ready to collaborate" 
            className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto hidden md:block" 
          />
        </div>
        
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6 bg-card p-8 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] relative">
          <div className="space-y-2">
            <Label htmlFor="name" className="not-italic">Name</Label>
            <Input 
              id="name" 
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="not-italic">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="not-italic">Role / Organisation</Label>
            <Input 
              id="role" 
              placeholder="Founder at..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="not-italic">What are you wrestling with?</Label>
            <Textarea 
              id="message" 
              placeholder="Tell me about your challenge, question, or what you're hoping to work on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-32 bg-background rounded-lg"
            />
          </div>
          
          {/* Honeypot field */}
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
            
          <PillButton 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </PillButton>
        </form>
      </div>
    </section>
  );
};
