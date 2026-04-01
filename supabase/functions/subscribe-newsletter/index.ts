import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BEEHIIV_API_KEY = Deno.env.get('BEEHIIV_API_KEY');
const BEEHIIV_PUBLICATION_ID = 'pub_b9e5eda8-3a17-4d9b-9f97-fb9208f49676';

// GA4 Measurement Protocol
const GA4_MEASUREMENT_ID = 'G-HNPPG3WWLN';
const GA4_API_SECRET = Deno.env.get('GA4_API_SECRET');

async function sendGA4Event(eventName: string, params: Record<string, string | number> = {}) {
  if (!GA4_API_SECRET) {
    console.warn('GA4_API_SECRET not configured, skipping server-side tracking');
    return;
  }
  
  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: crypto.randomUUID(), // Anonymous client ID for server-side events
          events: [{
            name: eventName,
            params: {
              ...params,
              engagement_time_msec: 100,
              session_id: Date.now().toString(),
            }
          }]
        })
      }
    );
    console.log(`GA4 event '${eventName}' sent, status:`, response.status);
  } catch (error) {
    console.error('GA4 tracking error:', error);
  }
}

interface SubscribeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Newsletter subscription request received');

    const { email }: SubscribeRequest = await req.json();

    // Validate email with proper regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email?.trim()?.toLowerCase();
    
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      console.error('Invalid email provided:', email);
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    if (!BEEHIIV_API_KEY) {
      console.error('BEEHIIV_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Newsletter service not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Subscribing email to Beehiiv:', trimmedEmail);

    // Subscribe to Beehiiv
    const beehiivUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`;
    
    const beehiivResponse = await fetch(beehiivUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email: trimmedEmail,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'website',
        utm_medium: 'organic',
      }),
    });

    const responseData = await beehiivResponse.json();

    if (!beehiivResponse.ok) {
      console.error('Beehiiv API error:', beehiivResponse.status, responseData);
      
      // Handle specific error cases
      if (beehiivResponse.status === 400 && responseData.errors) {
        return new Response(
          JSON.stringify({ 
            error: 'This email is already subscribed or invalid',
            details: responseData.errors 
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: 'Failed to subscribe to newsletter',
          details: responseData 
        }),
        {
          status: beehiivResponse.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Successfully subscribed email to Beehiiv:', trimmedEmail);

    // Send GA4 server-side event
    await sendGA4Event('newsletter_signup', {
      method: 'email',
      content_type: 'newsletter',
      source: 'server',
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: responseData 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in subscribe-newsletter function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        message: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
