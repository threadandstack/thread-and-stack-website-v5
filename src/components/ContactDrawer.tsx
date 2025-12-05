import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, X } from "lucide-react";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const contactSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  role: z.string().max(100, "Role must be less than 100 characters").optional(),
  message: z.string().max(5000, "Message must be less than 5000 characters").optional(),
});

interface ContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

export const ContactDrawer = ({ open, onOpenChange, source = "drawer" }: ContactDrawerProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, silently reject (bot detected)
    if (honeypot) {
      return;
    }
    
    setIsSubmitting(true);

    // Validate input with zod
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
      const { error } = await supabase
        .from('leads')
        .insert({
          name: name.trim() || null,
          email: email.trim(),
          message: fullMessage || null,
          source
        });

      if (error) throw error;

      supabase.functions.invoke('sync-lead-to-notion', {
        body: {
          name: name.trim() || null,
          email: email.trim(),
          message: fullMessage || null,
          source
        }
      }).catch(err => console.error('Notion sync error:', err));

      toast({
        title: "Thanks for reaching out!",
        description: "I'll be in touch soon."
      });
      
      setName("");
      setEmail("");
      setRole("");
      setMessage("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Lead submission error:", error);
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-light">Let's Work Together</SheetTitle>
        </SheetHeader>
        
        <p className="text-muted-foreground mb-6">
          Ready to build a brand that feels more human? Start a conversation and let's explore how we can work together.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="drawer-name" className="text-sm text-muted-foreground">Name</Label>
            <Input 
              id="drawer-name"
              type="text" 
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="drawer-email" className="text-sm text-muted-foreground">Email *</Label>
            <Input 
              id="drawer-email"
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background rounded-lg mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="drawer-role" className="text-sm text-muted-foreground">Role / Organisation</Label>
            <Input 
              id="drawer-role"
              type="text" 
              placeholder="Founder at..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-background rounded-lg mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="drawer-message" className="text-sm text-muted-foreground">What are you working on?</Label>
            <Textarea 
              id="drawer-message"
              placeholder="Tell me a bit about your project or what you're wrestling with..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            className="bg-background rounded-lg mt-1 min-h-[120px]"
          />
        </div>
        
        {/* Honeypot field - hidden from users, catches bots */}
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
        
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl group"
          >
            {isSubmitting ? "Sending..." : "Start the Conversation"}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
