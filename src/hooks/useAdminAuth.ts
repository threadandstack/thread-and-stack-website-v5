import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

// Add allowed admin emails here
const ALLOWED_ADMIN_EMAILS = [
  "brendan@thinkstudio.uk",
  // Add more emails as needed
];

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser?.email) {
          setIsAdmin(ALLOWED_ADMIN_EMAILS.includes(currentUser.email.toLowerCase()));
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.email) {
        setIsAdmin(ALLOWED_ADMIN_EMAILS.includes(currentUser.email.toLowerCase()));
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, isAdmin, signOut };
};
