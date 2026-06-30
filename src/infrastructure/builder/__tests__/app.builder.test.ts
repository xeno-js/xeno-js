import { describe, expect, it } from 'vitest'

import type { IHttpClient, IRemoteDataSource } from '@/domain'
import { TokenHelper } from '@/shared'

import { AppBuilder } from '../app.builder'

describe('AppBuilder Smoke Test', () => {
  it('It should complete the bootstrap of all modules without throwing exceptions', async () => {
    // 1. Arrange: Create an instance of AppBuilder to configure and build the application container.
    const builder = new AppBuilder()

    // 2. Act: Activate ALL flags and configurations to force the dynamic import
    // and registration of every single module and factory.
    builder
      .addMiddlewares()
      .addContext()
      .addLogger((config) => {
        config.console = true
        config.level = 0
        config.sentry.config = { dsn: 'https://dummy-sentry-dsn.local', environment: 'test' }
        config.pino.config = { env: 'test', destination: 'stdout', prettyPrint: true }
      })
      .addAuth((config) => {
        config.url = 'https://dummy-auth.local'
        config.key = 'dummy-key'
      })
      .addDb((config) => {
        config.connectionString = 'postgres://dummy:dummy@localhost:5432/dummy'
      })
      .addPipeline((config) => {
        config.performance.thresholdMs = 100
        config.authorization.tenant = true
        config.commandBus.idempotency = { lockTtlSeconds: 60, processedTtlSeconds: 300 }
        config.commandBus.concurrency = {
          maxRetries: 3,
          delayConfig: { baseDelayMs: 100, maxJitterMs: 50 },
        }
        config.queryBus.isEnabled = true
      })
      .addHttpCore((config) => {
        config.dataSourceToken = TokenHelper.createToken<IRemoteDataSource>('DUMMY_HTTP_CORE_TOKEN')
        config.http.token = TokenHelper.createToken<IHttpClient>('DUMMY_HTTP_TOKEN')
        config.http.client.baseURL = 'https://dummy-http-core.local'
        config.http.client.timeoutMs = 5000
        config.http.client.defaultHeaders = { 'X-Custom-Header': 'dummy-value' }
        config.resilience.retry.attempts = 5
      })

    // 3. Assert: Invoke the build method and ensure that the promise resolves
    // correctly, returning a defined container. If an import fails
    // or a Token is missing, the promise will be rejected and the test will fail.
    await expect(builder.build()).resolves.toBeDefined()
  })
})
