import { corsHeaders } from '../_shared/cors'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {}

  return new Response(
    JSON.stringify({
      service: 'anduril-supabase-gatekeeper',
      status: 'accepted',
      payload: body,
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
