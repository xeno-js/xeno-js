import fastify from 'fastify'
import { INJECTION_TOKENS } from '@xeno/core'
import { bootstrap } from './bootstrap'
import { ERROR_CONTROLLER_TOKEN, PING_CONTROLLER_TOKEN, STATUS_CONTROLLER_TOKEN, UNAUTHORIZED_CONTROLLER_TOKEN } from './tokens'

// ─────────────────────────────────────────────────────────────────────────────
// RUN DEMO FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function initializes the Xeno container, sets up the Fastify server, and defines two endpoints: one for handling a ping command and another for retrieving the status. It resolves the necessary controllers and middleware from the service container and starts the server on port 3000.
async function runDemo() {
    console.log('⚙️ Inizializzazione Xeno Container...')
    // 1. Bootstrap the application and get the service container
    const container = await bootstrap()

    // 2. Resolve the middleware and controllers from the container
    const middleware = container.resolve(INJECTION_TOKENS.MIDDLEWARE)
    const pingController = container.resolve(PING_CONTROLLER_TOKEN)
    const statusController = container.resolve(STATUS_CONTROLLER_TOKEN)
    const errorController = container.resolve(ERROR_CONTROLLER_TOKEN)
    const unauthController = container.resolve(UNAUTHORIZED_CONTROLLER_TOKEN)

    // 3. Create a Fastify instance to handle HTTP requests
    const app = fastify()

    // ─── ENDPOINT 1: COMMAND ──────────────────────────────────────────
    app.post('/api/ping', async (request, reply) => {

        // 4. Execute the middleware to handle the request context and authentication, then call the PingController's handle method with the request payload.
        const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
            const payload = request.body as { message: string }
            return await pingController.handle(payload)
        })

        return reply
            .status(responseDto.status)
            .type('application/json')
            .send(responseDto)
    })

    // ─── ENDPOINT 2: QUERY ────────────────────────────────────────────
    app.get('/api/status', async (request, reply) => {

        // 4. Execute the middleware to handle the request context and authentication, then call the StatusController's handle method with the request payload.
        const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
            const qs = request.query as { verbose?: string }
            const payload = { verbose: qs.verbose === 'true' }
            return await statusController.handle(payload)
        })

        return reply
            .status(responseDto.status)
            .type('application/json')
            .send(responseDto)
    })

    app.get('/api/error', async (request, reply) => {
        // 4. Execute the middleware to handle the request context and authentication, then call the ErrorController's handle method with the request payload.
        try {
            const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
                return await errorController.handle(null)
            })
            return reply
                .status(responseDto.status)
                .type('application/json')
                .send(responseDto)
        } catch (error) {
            console.error('Error in /api/error endpoint:', error)
            return reply
                .status(500)
                .type('application/json')
                .send({ error: 'Internal Server Error' })
        }
    })

    app.get('/api/unauthorize', async (request, reply) => {
        // 4. Execute the middleware to handle the request context and authentication, then call the ErrorController's handle method with the request payload.
        try {
            const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
                return await unauthController.handle(null)
            })
            return reply
                .status(responseDto.status)
                .type('application/json')
                .send(responseDto)
        } catch (error) {
            console.error('Error in /api/error endpoint:', error)
            return reply
                .status(500)
                .type('application/json')
                .send({ error: 'Internal Server Error' })
        }
    })

    // ─── START SERVER ─────────────────────────────────────────────────
    try {
        await app.listen({ port: 3000 })
        console.log('🚀 Execution Demo 02 running on http://localhost:3000')
        console.log('👉 POST /api/ping    (Body: { "message": "Hello" })')
        console.log('👉 GET  /api/status  (Query: ?verbose=true)')
        console.log('👉 GET  /api/error   (Simulated error endpoint)')
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

runDemo()