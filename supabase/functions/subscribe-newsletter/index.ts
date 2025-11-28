import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BEEHIIV_API_KEY = Deno.env.get('BEEHIIV_API_KEY');
const BEEHIIV_PUBLICATION_ID = 'pub_b9e5eda8-3a17-4d9b-9f97-fb9208f49676';

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

    // Validate email
    if (!email || !email.includes('@')) {
      console.error('Invalid email provided:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
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

    console.log('Subscribing email to Beehiiv:', email);

    // Subscribe to Beehiiv
    const beehiivUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`;
    
    const beehiivResponse = await fetch(beehiivUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
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

    console.log('Successfully subscribed email to Beehiiv:', email);

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
