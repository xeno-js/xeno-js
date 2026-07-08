import 'dotenv/config'
import fastify from 'fastify'
import { INJECTION_TOKENS } from '@xeno/core'
import { bootstrap } from './bootstrap'
import { UNAUTHORIZED_CONTROLLER_TOKEN, SAVE_USER_CONTROLLER_TOKEN, FIND_USER_CONTROLLER_TOKEN, UPDATE_USER_CONTROLLER_TOKEN, FIND_ALL_USERS_QUERY_CONTROLLER_TOKEN } from './tokens'
import { UserProps } from './user/entity/user'

// ─────────────────────────────────────────────────────────────────────────────
// RUN DEMO FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function initializes the Xeno container, sets up the Fastify server, and defines two endpoints: one for handling a ping command and another for retrieving the status. It resolves the necessary controllers and middleware from the service container and starts the server on port 3000.
async function runDemo() {
    console.log('⚙️ Initialized Xeno Container...')
    // 1. Bootstrap the application and get the service container
    try {
        const container = await bootstrap()

        console.log('🚀 Starting Fastify server on http://localhost:3000...')

        // 2. Resolve the middleware and controllers from the container
        const middleware = container.resolve(INJECTION_TOKENS.MIDDLEWARE)
        const saveUserController = container.resolve(SAVE_USER_CONTROLLER_TOKEN)
        const findUserController = container.resolve(FIND_USER_CONTROLLER_TOKEN)
        const unauthController = container.resolve(UNAUTHORIZED_CONTROLLER_TOKEN)
        const updateUserController = container.resolve(UPDATE_USER_CONTROLLER_TOKEN)
        const findAllUsersController = container.resolve(FIND_ALL_USERS_QUERY_CONTROLLER_TOKEN)

        console.log('✅ Middleware and Controllers resolved from the container.')
        // 3. Create a Fastify instance to handle HTTP requests
        const app = fastify()

        console.log('✅ Fastify instance created. Setting up routes...')
        // ─── ENDPOINT 1: COMMAND ──────────────────────────────────────────
        app.post('/api/user', async (request, reply) => {

            // 4. Execute the middleware to handle the request context and authentication, then call the PingController's handle method with the request payload.
            const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
                const payload = request.body as UserProps
                return await saveUserController.handle(payload)
            })

            return reply
                .status(responseDto.status)
                .type('application/json')
                .send(responseDto.data)
        })

        app.patch('/api/user/:id', async (request, reply) => {
            // 4. Execute the middleware to handle the request context and authentication, then call the PingController's handle method with the request payload.
            const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
                const { id } = request.params as any
                const payload = { id: id ?? '123', ...request.body as UserProps } as UserProps & { id: string }
                return await updateUserController.handle(payload)
            })
            return reply
                .status(responseDto.status)
                .type('application/json')
                .send(responseDto.data)
        })

        // ─── ENDPOINT 2: QUERY ────────────────────────────────────────────
        app.get('/api/user/:id', async (request, reply) => {

            // 4. Execute the middleware to handle the request context and authentication, then call the StatusController's handle method with the request payload.
            const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
                const { id } = request.params as any
                const payload = { id: id ?? '123' }
                return await findUserController.handle(payload)
            })

            return reply
                .status(responseDto.status)
                .type('application/json')
                .send(responseDto.data)
        })

        app.get('/api/user', async (request, reply) => {
            // 4. Execute the middleware to handle the request context and authentication, then call the StatusController's handle method with the request payload.
            const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
                return await findAllUsersController.handle()
            })

            return reply
                .status(responseDto.status)
                .type('application/json')
                .send(responseDto.data)
        })

        app.get('/api/unauthorized', async (request, reply) => {
            // 4. Execute the middleware to handle the request context and authentication, then call the ErrorController's handle method with the request payload.
            try {
                const responseDto = await middleware.execute(request.url as any, request.headers as any, async () => {
                    return await unauthController.handle(null)
                })
                return reply
                    .status(responseDto.status)
                    .type('application/json')
                    .send(responseDto.data)
            } catch (error) {
                console.error('Error in /api/unauthorized endpoint:', error)
                return reply
                    .status(500)
                    .type('application/json')
                    .send({ error: 'Internal Server Error' })
            }
        })

        console.log('✅ Routes set up. Ready to accept requests.')

        // ─── START SERVER ─────────────────────────────────────────────────
        try {
            await app.listen({ port: 3000 })
            console.log('🚀 Execution Demo 02 running on http://localhost:3000')
            console.log('👉 POST /api/user (Command: {name: "John Doe", email: "john.doe@example.com", password: "password123", userId: "user-123", tenantId: "tenant-456"})')
            console.log('👉 GET  /api/user/:id  (Query: api/user/1)')
            console.log('👉 PATCH /api/user/update/:id (Command: {name: "John Doe Updated", email: "john.doe.updated@example.com", password: "newpassword123", userId: "user-123", tenantId: "tenant-456"})')
            console.log('👉 GET  /api/unauthorized   (Simulated unauthorized endpoint)')
        } catch (err) {
            console.error('Error starting Fastify server:', err)
            app.log.error(err)
            process.exit(1)
        }
    } catch (error) {
        console.error('Error during bootstrap or server setup:', error)
        process.exit(1)
    }
}

runDemo()