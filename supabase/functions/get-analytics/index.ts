import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["br@brendanrodgers.uk", "br@threadandstack.com"];

interface AnalyticsRequest {
  startDate: string;
  endDate: string;
  granularity: "hourly" | "daily";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ADMIN_EMAILS.includes(user.email ?? "")) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { startDate, endDate } = (await req.json()) as AnalyticsRequest;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate daily data based on date range
    const dailyData = [];
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      // Use date as seed for consistent "random" data
      const seed = date.getDate() + date.getMonth() * 31;
      const baseVisits = 10 + (seed % 15);
      const baseSessiond = 5 + (seed % 10);
      
      dailyData.push({
        date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        visits: baseVisits,
        sessions: baseSessiond,
      });
    }

    // Calculate totals from daily data
    const totalVisits = dailyData.reduce((sum, d) => sum + d.visits, 0);
    const totalSessions = dailyData.reduce((sum, d) => sum + d.sessions, 0);
    const bounceRate = 25 + (daysDiff % 20);
    const bounces = Math.round((bounceRate / 100) * totalSessions);

    const response = {
      visits: totalVisits,
      sessions: totalSessions,
      bounces,
      bounceRate,
      pageviewsPerVisit: parseFloat((totalVisits / totalSessions).toFixed(1)),
      avgSessionDuration: 120 + (daysDiff * 5),
      topPages: [
        { path: "/", visits: Math.floor(totalVisits * 0.40) },
        { path: "/blog", visits: Math.floor(totalVisits * 0.20) },
        { path: "/about", visits: Math.floor(totalVisits * 0.15) },
        { path: "/how-i-work", visits: Math.floor(totalVisits * 0.12) },
        { path: "/sessions-and-sprints", visits: Math.floor(totalVisits * 0.08) },
      ],
      trafficSources: [
        { source: "Direct", visits: Math.floor(totalSessions * 0.65) },
        { source: "google.com", visits: Math.floor(totalSessions * 0.20) },
        { source: "linkedin.com", visits: Math.floor(totalSessions * 0.10) },
        { source: "twitter.com", visits: Math.floor(totalSessions * 0.05) },
      ],
      devices: [
        { device: "desktop", visits: Math.floor(totalSessions * 0.60) },
        { device: "mobile", visits: Math.floor(totalSessions * 0.35) },
        { device: "tablet", visits: Math.floor(totalSessions * 0.05) },
      ],
      countries: [
        { country: "GB", visits: Math.floor(totalSessions * 0.45) },
        { country: "US", visits: Math.floor(totalSessions * 0.30) },
        { country: "DE", visits: Math.floor(totalSessions * 0.10) },
        { country: "FR", visits: Math.floor(totalSessions * 0.08) },
        { country: "ES", visits: Math.floor(totalSessions * 0.07) },
      ],
      dailyData,
      _note: "Demo data - connect GA4 for real analytics",
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch analytics";
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
