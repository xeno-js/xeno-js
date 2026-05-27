export const config = {
  runtime: 'edge',
}

export default function handler(): Response {
  return new Response(
    JSON.stringify({
      service: 'anduril-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    },
  )
}
