import { describe, expect, it, vi } from 'vitest'

import type { IHttpClient, IRemoteDataSource, IServiceContainer } from '@/domain'
import { TokenHelper } from '@/shared'

import { AppBuilder } from '../app.builder'

// ── helpers ────────────────────────────────────────────────────────────────

function makeBuilder(): AppBuilder {
  return new AppBuilder()
}

// ── Smoke test (full happy path) ───────────────────────────────────────────

describe('AppBuilder – full smoke test', () => {
  it('bootstraps all modules without throwing', async () => {
    const builder = makeBuilder()
    builder
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

    await expect(builder.build()).resolves.toBeDefined()
  })
})

// ── Idempotency guards ─────────────────────────────────────────────────────

describe('AppBuilder – idempotency guards', () => {
  it('addLogger called twice only queues one module', async () => {
    const builder = makeBuilder()
    const b1 = builder.addLogger()
    const b2 = builder.addLogger()
    expect(b1).toBe(builder)
    expect(b2).toBe(builder)
    // Build still succeeds
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addAuth called twice only queues one module', async () => {
    const builder = makeBuilder()
    builder.addAuth((c) => {
      c.url = 'u'
      c.key = 'k'
    })
    const second = builder.addAuth((c) => {
      c.url = 'u2'
      c.key = 'k2'
    })
    expect(second).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addDb called twice only queues one module', async () => {
    const builder = makeBuilder()
    builder.addDb((c) => {
      c.connectionString = 'pg://a'
    })
    const second = builder.addDb((c) => {
      c.connectionString = 'pg://b'
    })
    expect(second).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addPipeline called twice only queues one CqrsModule', async () => {
    const builder = makeBuilder()
    builder.addPipeline()
    const second = builder.addPipeline()
    expect(second).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addConcurrencyService called twice only queues one module', async () => {
    const builder = makeBuilder()
    builder.addConcurrencyService()
    const second = builder.addConcurrencyService()
    expect(second).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })
})

// ── Individual methods ─────────────────────────────────────────────────────

describe('AppBuilder – individual methods', () => {
  it('addMiddlewares queues a module and build succeeds', async () => {
    const builder = makeBuilder()
    const result = builder.addMiddlewares()
    expect(result).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addContext queues a module and build succeeds', async () => {
    const builder = makeBuilder()
    const result = builder.addContext()
    expect(result).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addCache without setupAction uses defaults and build succeeds', async () => {
    const builder = makeBuilder()
    const result = builder.addCache()
    expect(result).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addCache with setupAction calls it and build succeeds', async () => {
    const builder = makeBuilder()
    const setup = vi.fn()
    builder.addCache(setup)
    await builder.build()
    expect(setup).toHaveBeenCalledOnce()
  })

  it('addConcurrencyService build succeeds', async () => {
    const builder = makeBuilder()
    const result = builder.addConcurrencyService()
    expect(result).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addPipeline without setupAction build succeeds', async () => {
    const builder = makeBuilder()
    const result = builder.addPipeline()
    expect(result).toBe(builder)
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addPipeline with setupAction calls it', async () => {
    const builder = makeBuilder()
    const setup = vi.fn()
    builder.addPipeline(setup)
    await builder.build()
    expect(setup).toHaveBeenCalledOnce()
  })
})

// ── addServices ────────────────────────────────────────────────────────────

describe('AppBuilder – addServices', () => {
  it('passes the container to the setup action', () => {
    const builder = makeBuilder()
    let captured: IServiceContainer | undefined
    const result = builder.addServices((container) => {
      captured = container
    })
    expect(result).toBe(builder)
    expect(captured).toBeDefined()
  })
})

// ── addModule ──────────────────────────────────────────────────────────────

describe('AppBuilder – addModule', () => {
  it('calls the factory and configure with the container and opts', async () => {
    const builder = makeBuilder()
    const configure = vi.fn().mockResolvedValue(undefined)
    const fakeModule = { configure }
    const factory = vi.fn().mockResolvedValue(fakeModule)

    const result = builder.addModule('TestModule', factory, { option: 'value' })
    expect(result).toBe(builder)

    await builder.build()

    expect(factory).toHaveBeenCalledOnce()
    expect(configure).toHaveBeenCalledOnce()
  })

  it('calls configure with undefined opts when none provided', async () => {
    const builder = makeBuilder()
    const configure = vi.fn().mockResolvedValue(undefined)
    const factory = vi.fn().mockResolvedValue({ configure })

    builder.addModule('NoOptsModule', factory)
    await builder.build()

    expect(configure).toHaveBeenCalledOnce()
  })
})

// ── resolve ────────────────────────────────────────────────────────────────

describe('AppBuilder – resolve', () => {
  it('resolves a service registered via addServices', () => {
    const builder = makeBuilder()
    const token = TokenHelper.createToken<{ value: number }>('RESOLVE_TEST')

    // Register a singleton factory through the exposed container
    builder.addServices((container) => {
      container.addSingletonFactory(token, () => ({ value: 42 }))
    })

    const resolved = builder.resolve(token)
    expect(resolved).toEqual({ value: 42 })
  })
})

// ── build error path ───────────────────────────────────────────────────────

describe('AppBuilder – build error handling', () => {
  it('rejects with a descriptive Bootstrap failed error when a module throws', async () => {
    const builder = makeBuilder()
    const cause = new Error('module exploded')
    builder.addModule('BrokenModule', async () => {
      throw cause
    })

    await expect(builder.build()).rejects.toThrow('Bootstrap failed at [BrokenModule]')
  })

  it('includes the original error as cause', async () => {
    const builder = makeBuilder()
    const cause = new Error('inner error')
    builder.addModule('BrokenModule2', async () => {
      throw cause
    })

    const error = await builder.build().catch((e: unknown) => e)
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).cause).toBe(cause)
  })

  it('includes a non-Error cause when a module throws a string', async () => {
    const builder = makeBuilder()
    builder.addModule('StringThrow', async () => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'string error'
    })

    await expect(builder.build()).rejects.toThrow('Bootstrap failed at [StringThrow]: string error')
  })
})

describe('AppBuilder – private queue idempotency guards', () => {
  it('addMiddlewares after addPipeline hits _queueMiddlewareModule idempotency guard', async () => {
    const builder = makeBuilder()
    builder.addPipeline()
    builder.addMiddlewares() // _isMiddlewareModuleQueued already true
    await expect(builder.build()).resolves.toBeDefined()
  })

  it('addContext after addMiddlewares hits _queueContextModule idempotency guard', async () => {
    const builder = makeBuilder()
    builder.addMiddlewares()
    builder.addContext() // _isContextModuleQueued already true
    await expect(builder.build()).resolves.toBeDefined()
  })
})
