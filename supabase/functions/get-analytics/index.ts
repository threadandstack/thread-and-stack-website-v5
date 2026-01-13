import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsRequest {
  startDate: string;
  endDate: string;
  granularity: "hourly" | "daily";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, granularity } = (await req.json()) as AnalyticsRequest;
    const projectId = "167ee777-2331-437f-9777-73c91bb58bab";
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Fetch real analytics from Lovable API
    const analyticsResponse = await fetch(
      `https://api.lovable.dev/v1/projects/${projectId}/analytics?startDate=${startDate}&endDate=${endDate}&granularity=${granularity}`,
      {
        headers: {
          "Authorization": `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!analyticsResponse.ok) {
      const errorText = await analyticsResponse.text();
      console.error("Lovable API error:", errorText);
      throw new Error(`Failed to fetch analytics: ${analyticsResponse.status}`);
    }

    const data = await analyticsResponse.json();
    
    // Transform the data to our expected format
    const visitors = data.overview?.visitors?.total || 0;
    const pageviews = data.overview?.pageviews?.total || 0;
    const bounceRate = data.overview?.bounceRate?.total || 0;
    
    // Calculate sessions (visitors) and bounces
    const sessions = visitors;
    const bounces = Math.round((bounceRate / 100) * sessions);

    // Build daily data from the breakdown
    const dailyData = (data.overview?.pageviews?.breakdown || []).map((item: { date: string; value: number }, index: number) => {
      const date = new Date(item.date);
      const visitorBreakdown = data.overview?.visitors?.breakdown || [];
      return {
        date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        visits: item.value,
        sessions: visitorBreakdown[index]?.value || 0,
      };
    });

    // Build top pages from dimensions
    const topPages = (data.dimensions?.page || []).map((item: { name: string; value: number }) => ({
      path: item.name,
      visits: item.value,
    }));

    // Build traffic sources
    const trafficSources = (data.dimensions?.source || []).map((item: { name: string; value: number }) => ({
      source: item.name,
      visits: item.value,
    }));

    // Build device breakdown
    const devices = (data.dimensions?.device || []).map((item: { name: string; value: number }) => ({
      device: item.name,
      visits: item.value,
    }));

    // Build country breakdown
    const countries = (data.dimensions?.country || []).map((item: { name: string; value: number }) => ({
      country: item.name,
      visits: item.value,
    }));

    const response = {
      visits: pageviews,
      sessions,
      bounces,
      bounceRate: Math.round(bounceRate),
      pageviewsPerVisit: data.overview?.pageviewsPerVisit?.total || 0,
      avgSessionDuration: data.overview?.sessionDuration?.total || 0,
      topPages,
      trafficSources,
      devices,
      countries,
      dailyData,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch analytics";
    console.error("Error fetching analytics:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
