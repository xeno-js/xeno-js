import { AppBuilder } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'
import { DATA_SOURCE_TOKEN, HTTP_CLIENT_TOKEN } from './tokens'

// ─────────────────────────────────────────────────────────────────────────────
// BOOTSTRAP FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function sets up the application by configuring the database connection, registering a custom data source, and preparing the dependency injection container. It ensures that the necessary components are available for performing database operations in a clean and maintainable manner.
export async function bootstrap(): Promise<IServiceContainer> {
    const builder = new AppBuilder()

    builder.addHttpCore((opts) => {
        opts.dataSourceToken = DATA_SOURCE_TOKEN
        opts.http.client.baseURL = 'https://pokeapi.co/api/v2/'
        opts.http.client.timeoutMs = 5000
        opts.http.token = HTTP_CLIENT_TOKEN
        opts.resilience.retry.attempts = 3
        opts.resilience.circuitBreaker.consecutiveFailures = 5
    })

    // C. BUILD THE CONTAINER (WHICH WILL INVOKE THE DB MODULE FACTORY)
    return await builder.build()
}
