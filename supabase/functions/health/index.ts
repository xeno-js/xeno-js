import { corsHeaders } from '../_shared/cors'

Deno.serve((request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  return new Response(
    JSON.stringify({
      service: 'anduril-supabase-health',
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        'content-type': 'application/json',
      },
    },
  )
})
