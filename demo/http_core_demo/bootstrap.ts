import { AppBuilder, TOKENS } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'
import { AppRegistry } from './registry'
import { CustomDataSource } from './datasources/custom.datasource'

// ─────────────────────────────────────────────────────────────────────────────
// BOOTSTRAP FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function sets up the application by configuring the database connection, registering a custom data source, and preparing the dependency injection container. It ensures that the necessary components are available for performing database operations in a clean and maintainable manner.
export async function bootstrap(): Promise<IServiceContainer<AppRegistry>> {
    const builder = new AppBuilder<AppRegistry>()

    builder.addHttpCore((opts, config) => {
        opts.dataSourceToken = (container) => {
            container.addSingleton('CUSTOM_DATA_SOURCE_TOKEN', (c) => new CustomDataSource(c.resolve('MY_HTTP_CLIENT_TOKEN'), c.resolve(TOKENS.RESILIENCE_CLIENT)))
        }
        opts.http.client.baseURL = config.get('POKEAPI_BASE_URL', 'https://pokeapi.co/api/v2/')
        opts.http.client.timeoutMs = 5000
        opts.http.token = 'MY_HTTP_CLIENT_TOKEN'
        opts.resilience.retry.attempts = 10 // 10 attempts for retrying failed requests
        opts.resilience.retry.baseDelayMs = 100 // 100 milliseconds base delay for retrying failed requests
        opts.resilience.retry.maxDelayMs = 1000 // 1000 milliseconds max delay for retrying failed requests
        opts.resilience.circuitBreaker.consecutiveFailures = 7 // 7 consecutive failures to open the circuit
        opts.resilience.circuitBreaker.halfOpenTimeoutMs = 5000 // 5000 milliseconds timeout for half-open state
        opts.resilience.bulkhead.maxConcurrent = 5 // 5 concurrent requests allowed
    })

    // C. BUILD THE CONTAINER (WHICH WILL INVOKE THE DB MODULE FACTORY)
    return await builder.build()
}
