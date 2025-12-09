import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');
const NOTION_DATABASE_ID = '2bd8863b87d480669541f70cf640a28f';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, source } = await req.json();

    console.log('Syncing lead to Notion:', { name, email, source });

    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY is not configured');
    }

    // Server-side validation (defense-in-depth alongside client-side Zod validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email?.trim()?.toLowerCase();

    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      throw new Error('Invalid email');
    }
    if (name && name.length > 100) {
      throw new Error('Name too long');
    }
    if (message && message.length > 5000) {
      throw new Error('Message too long');
    }

    // Create a page in the Notion database
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: {
          database_id: NOTION_DATABASE_ID,
        },
        properties: {
          // Title property - using "Name" as the title field
          'Name': {
            title: [
              {
                text: {
                  content: name || 'Anonymous',
                },
              },
            ],
          },
          // Email as rich text
          'Email': {
            email: email,
          },
          // Message as rich text
          'Message': {
            rich_text: [
              {
                text: {
                  content: message || '',
                },
              },
            ],
          },
          // Source as select or rich text
          'Source': {
            rich_text: [
              {
                text: {
                  content: source || 'website',
                },
              },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API error:', errorData);
      throw new Error(`Notion API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Lead synced to Notion successfully:', data.id);

    return new Response(JSON.stringify({ success: true, notionPageId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error syncing lead to Notion:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
