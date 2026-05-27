import { z } from 'zod'

export const config = {
  runtime: 'edge',
}

const inputSchema = z.object({
  route: z.string().min(1).default('default'),
})

export default function handler(request: Request): Response {
  const { searchParams } = new URL(request.url)
  const parsed = inputSchema.safeParse({
    route: searchParams.get('route') ?? undefined,
  })

  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        service: 'anduril-gatekeeper',
        status: 'invalid_request',
        errors: parsed.error.flatten(),
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  }

  return new Response(
    JSON.stringify({
      service: 'anduril-gatekeeper',
      status: 'accepted',
      route: parsed.data.route,
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
