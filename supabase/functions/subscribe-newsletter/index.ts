import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KIT_API_SECRET = Deno.env.get('KIT_API_SECRET');
const KIT_API_BASE = 'https://api.kit.com/v4';

// GA4 Measurement Protocol
const GA4_MEASUREMENT_ID = 'G-HNPPG3WWLN';
const GA4_API_SECRET = Deno.env.get('GA4_API_SECRET');

async function sendGA4Event(eventName: string, params: Record<string, string | number> = {}) {
  if (!GA4_API_SECRET) return;
  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: crypto.randomUUID(),
          events: [{
            name: eventName,
            params: { ...params, engagement_time_msec: 100, session_id: Date.now().toString() },
          }],
        }),
      },
    );
  } catch (error) {
    console.error('GA4 tracking error:', error);
  }
}

interface SubscribeRequest {
  email: string;
  first_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name }: SubscribeRequest = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email?.trim()?.toLowerCase();

    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      );
    }

    if (!KIT_API_SECRET) {
      console.error('KIT_API_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Newsletter service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      );
    }

    console.log('Subscribing email to Kit:', trimmedEmail);

    const kitResponse = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': KIT_API_SECRET,
      },
      body: JSON.stringify({
        email_address: trimmedEmail,
        first_name: first_name?.trim() || undefined,
        state: 'active',
      }),
    });

    const responseData = await kitResponse.json().catch(() => ({}));

    if (!kitResponse.ok) {
      console.error('Kit API error:', kitResponse.status, responseData);

      // Treat duplicates as success — subscriber already exists
      const errMsg = JSON.stringify(responseData).toLowerCase();
      if (kitResponse.status === 422 || errMsg.includes('already') || errMsg.includes('taken')) {
        return new Response(
          JSON.stringify({ success: true, message: 'Already subscribed', data: responseData }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to subscribe to newsletter', details: responseData }),
        { status: kitResponse.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      );
    }

    console.log('Successfully subscribed to Kit:', trimmedEmail);

    await sendGA4Event('newsletter_signup', {
      method: 'email',
      content_type: 'newsletter',
      source: 'server',
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed to newsletter', data: responseData }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  } catch (error: any) {
    console.error('Error in subscribe-newsletter function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  }
};

serve(handler);
