import fastify from 'fastify'
import { INJECTION_TOKENS } from '@gantry5/core'
import { bootstrap } from './bootstrap'
import { PING_CONTROLLER_TOKEN, STATUS_CONTROLLER_TOKEN } from './tokens'

// ─────────────────────────────────────────────────────────────────────────────
// RUN DEMO FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function initializes the Gantry5 container, sets up the Fastify server, and defines two endpoints: one for handling a ping command and another for retrieving the status. It resolves the necessary controllers and middleware from the service container and starts the server on port 3000.
async function runDemo() {
    console.log('⚙️ Inizializzazione Gantry5 Container...')
    // 1. Bootstrap the application and get the service container
    const container = await bootstrap()

    // 2. Resolve the middleware and controllers from the container
    const middleware = container.resolve(INJECTION_TOKENS.MIDDLEWARE)
    const pingController = container.resolve(PING_CONTROLLER_TOKEN)
    const statusController = container.resolve(STATUS_CONTROLLER_TOKEN)

    // 3. Create a Fastify instance to handle HTTP requests
    const app = fastify()

    // ─── ENDPOINT 1: COMMAND ──────────────────────────────────────────
    app.post('/api/ping', async (request, reply) => {

        // 4. Execute the middleware to handle the request context and authentication, then call the PingController's handle method with the request payload.
        const responseDto = await middleware.execute(request.headers as any, async () => {
            const payload = request.body as { message: string }
            return await pingController.handle(payload)
        })

        return reply
            .status(responseDto.status)
            .type('application/json')
            .send(responseDto.data)
    })

    // ─── ENDPOINT 2: QUERY ────────────────────────────────────────────
    app.get('/api/status', async (request, reply) => {

        // 4. Execute the middleware to handle the request context and authentication, then call the StatusController's handle method with the request payload.
        const responseDto = await middleware.execute(request.headers as any, async () => {
            const qs = request.query as { verbose?: string }
            const payload = { verbose: qs.verbose === 'true' }
            return await statusController.handle(payload)
        })

        return reply
            .status(responseDto.status)
            .type('application/json')
            .send(responseDto.data)
    })

    // ─── START SERVER ─────────────────────────────────────────────────
    try {
        await app.listen({ port: 3000 })
        console.log('🚀 Execution Demo 02 running on http://localhost:3000')
        console.log('👉 POST /api/ping    (Body: { "message": "Hello" })')
        console.log('👉 GET  /api/status  (Query: ?verbose=true)')
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

runDemo()