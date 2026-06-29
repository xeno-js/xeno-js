import type { IModule, IServiceContainer } from '@/domain'
import type { InjectionToken, SetupAction } from '@/shared'
import { Guards, LOG_LEVEL } from '@/shared'

import { ServiceContainer } from '../container/service-container'
import type {
  AuthClientConfig,
  CacheConfig,
  DbConfig,
  HttpConfig,
  HttpCoreConfig,
  LoggerConfig,
  PipelineConfig,
  ResilienceConfig,
} from '../modules/config'

/**
 * @description The AppBuilder class provides a fluent, .NET-style API for configuring and bootstrapping the application. It orchestrates the registration of various modules (CQRS, HTTP, Database, Logging, Auth) into the ServiceContainer.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
interface QueuedModule {
  name: string
  action: () => Promise<void>
}

/**
 * @description The AppBuilder class provides a fluent, .NET-style API for configuring and bootstrapping the application.
 * It orchestrates the registration of various modules (CQRS, HTTP, Database, Logging, Auth) into the ServiceContainer.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class AppBuilder {
  private readonly _container: IServiceContainer = new ServiceContainer()

  // --- Module Configurations ---
  private readonly _modules: QueuedModule[] = []

  // --- Specific Configurations ---
  private _pipelineConfig: PipelineConfig = {
    performance: { thresholdMs: 500 },
    authorization: {
      tenant: false,
      policy: { role: false, permission: false, policyRegistry: undefined },
      customAuthorizationStrategy: undefined,
    },
    validation: {
      zod: undefined,
      customValidationStrategy: undefined,
    },
    commandBus: {
      idempotency: undefined,
      concurrency: undefined,
    },
    queryBus: { isEnabled: false },
  }

  // --- Module Queuing Flags ---
  private _isContextModuleQueued = false
  private _isMiddlewareModuleQueued = false
  private _isPipelineModuleQueued = false
  private _isLoggerModuleQueued = false
  private _isAuthModuleQueued = false
  private _isDbContextModuleQueued = false
  private _isConcurrencyServiceQueued = false
  private _isResilienceModuleQueued = false

  // ─────────────────────────────────────────────────────────────────────────────
  // Application Modules Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Enables the use of middlewares in the application. Middlewares can be used for cross-cutting concerns such as logging, authentication, and request/response manipulation.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addMiddlewares(): this {
    this._queueMiddlewareModule()
    return this
  }

  /**
   * @description Enables the use of context in the application. Context can be used to store and manage request-specific data, such as user information, correlation IDs, and other metadata that needs to be accessible throughout the request lifecycle.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addContext(): this {
    this._queueContextModule()
    return this
  }

  /**
   * @description Configures the logger for the application. This method allows you to set up logging options such as log level, console logging, and integration with external logging services like Sentry or Pino.
   * @param setupAction A callback function that receives a LoggerConfig object to configure the logger settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addLogger(setupAction: SetupAction<LoggerConfig>): this {
    if (this._isLoggerModuleQueued) return this
    this._isLoggerModuleQueued = true
    const config = {
      level: LOG_LEVEL.DEBUG,
      console: true,
      sentry: { config: undefined },
      pino: { config: undefined },
      customLoggers: undefined,
    }
    setupAction(config)
    this._modules.push({
      name: 'LoggerModule',
      action: async () => {
        const { LoggerUtils } = await import('../modules/utils/logger.utils')
        await LoggerUtils.addLogger(this._container, config)
      },
    })
    return this
  }

  /**
   * @description Configures the caching settings for the application. This method allows you to set up caching options such as Redis configuration or in-memory caching.
   * @param setupAction A callback function that receives a CacheConfig object to configure the caching settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addCache(setupAction: SetupAction<CacheConfig>): this {
    const config = { inMemory: true, redis: undefined }
    setupAction(config)
    this._modules.push({
      name: 'CacheModule',
      action: async () => {
        const { CacheUtils } = await import('../modules/utils/cache.utils')
        await CacheUtils.addCache(this._container, config)
      },
    })
    return this
  }

  /**
   * @description Configures the authentication client for the application. This method allows you to set up authentication options such as the authentication server URL, API key, and additional options.
   * @param setupAction A callback function that receives an AuthClientConfig object to configure the authentication client settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addAuth(setupAction: SetupAction<AuthClientConfig>): this {
    if (this._isAuthModuleQueued) return this
    this._isAuthModuleQueued = true
    const config = { url: '', key: '', options: undefined }
    setupAction(config)
    this._modules.push({
      name: 'AuthModule',
      action: async () => {
        const { AuthUtils } = await import('../modules/utils/auth.utils')
        await AuthUtils.addAuthN(this._container, config)
      },
    })
    return this
  }

  /**
   * @description Configures the database settings for the application. This method allows you to set up database options such as enabling/disabling the database, connection string, and table definitions.
   * @param setupAction A callback function that receives a DbConfig object to configure the database settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addDb(setupAction: SetupAction<DbConfig>): this {
    if (this._isDbContextModuleQueued) return this
    this._isDbContextModuleQueued = true
    const config = { connectionString: '', tables: {} }
    setupAction(config)
    this._modules.push({
      name: 'DbModule',
      action: async () => {
        const { DbModule } = await import('../modules/db.module')
        const dbModule = new DbModule()
        await dbModule.configure(this._container, config)
      },
    })
    return this
  }

  /**
   * @description Enables the use of the service for concurrency control in the application. This method allows you to limit the number of concurrent asynchronous tasks being executed, which is useful for managing system resources and preventing event loop blocking during massive batch operations.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addConcurrencyService(): this {
    if (this._isConcurrencyServiceQueued) return this
    this._isConcurrencyServiceQueued = true
    this._modules.push({
      name: 'ConcurrencyServiceModule',
      action: async () => {
        const { PLimitConcurrencyService } = await import('../services/concurrency')
        const { INJECTION_TOKENS } = await import('../di/injection-tokens.constants')
        this._container.addSingleton(
          INJECTION_TOKENS.CONCURRENCY_SERVICE,
          PLimitConcurrencyService,
          [],
        )
      },
    })
    return this
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CQRS Pipeline Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Configures the CQRS pipeline settings for the application. This method allows you to set up various aspects of the CQRS pipeline, including performance monitoring, authorization, validation, command bus settings, and query bus settings.
   * @param setupAction A callback function that receives a PipelineConfig object to configure the CQRS pipeline settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addPipeline(setupAction: SetupAction<PipelineConfig>): this {
    setupAction(this._pipelineConfig)
    this._queuePipelineModule()
    return this
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HTTP & Resilience Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Configures the HTTP settings for the application. This method allows you to set up HTTP options such as authentication token, headers, and other HTTP client configurations.
   * @param setupAction A callback function that receives an HttpConfig object to configure the HTTP settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addHttp(setupAction: SetupAction<HttpConfig>): this {
    const config = { token: undefined, client: {} } as unknown as HttpConfig
    setupAction(config)
    this._modules.push({
      name: 'HttpModule',
      action: async () => {
        const { HttpUtils } = await import('../modules/utils/http.utils')
        await HttpUtils.addAxios(this._container, config)
      },
    })
    return this
  }

  /**
   * @description Configures the resilience settings for the application. This method allows you to set up resilience options such as retry policies, circuit breakers, and bulkhead isolation.
   * @param setupAction A callback function that receives a ResilienceConfig object to configure the resilience settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addResilience(setupAction: SetupAction<ResilienceConfig>): this {
    if (this._isResilienceModuleQueued) return this
    this._isResilienceModuleQueued = true
    const resilienceConfig = {
      retry: {
        attempts: undefined,
        baseDelayMs: undefined,
        maxDelayMs: undefined,
      },
      circuitBreaker: {
        consecutiveFailures: undefined,
        halfOpenTimeoutMs: undefined,
      },
      bulkhead: {
        maxConcurrent: undefined,
      },
    }
    setupAction(resilienceConfig)
    this._modules.push({
      name: 'ResilienceModule',
      action: async () => {
        const { HttpUtils } = await import('../modules/utils/http.utils')
        await HttpUtils.addResilience(this._container, resilienceConfig)
      },
    })
    return this
  }

  /**
   * @description Configures the HTTP core settings for the application. This method allows you to set up HTTP core options such as data source token, HTTP client configuration, and resilience settings.
   * @param setupAction A callback function that receives an HttpCoreConfig object to configure the HTTP core settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addHttpCore(setupAction: SetupAction<HttpCoreConfig>): this {
    const config = {
      dataSourceToken: undefined as unknown,
      http: { token: undefined as unknown, client: {} },
      resilience: { retry: {}, circuitBreaker: {}, bulkhead: {} },
    } as unknown as HttpCoreConfig
    setupAction(config)
    this._modules.push({
      name: 'HttpCoreModule',
      action: async () => {
        const { HttpCoreModule } = await import('../modules/http-core.module')
        const coreModule = new HttpCoreModule()
        await coreModule.configure(this._container, config)
      },
    })
    return this
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Dependency Injection Pass-through Methods
  // ─────────────────────────────────────────────────────────────────────────────
  // Dependency Injection Pass-through Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Registers services in the application. This method allows you to add custom services to the dependency injection container, enabling modular and organized configuration of services.
   * @param setupAction A callback function that receives the IServiceContainer to register services.
   * @returns The current instance of AppBuilder for method chaining.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  public addServices(setupAction: SetupAction<IServiceContainer>): this {
    setupAction(this._container)
    return this
  }

  /**
   * @description Registers a module in the application. A module is a self-contained unit of functionality that can configure services and dependencies in the service container. This method allows you to add custom modules to the application, enabling modular and organized configuration of services.
   * @param factory A factory function that creates the module instance.
   * @param opts Optional configuration options for the module.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public addModule<T>(name: string, factory: () => Promise<IModule<T>>, opts?: T): this {
    this._modules.push({
      name,
      action: async () => {
        const module = await factory()
        await module.configure(this._container, opts)
      },
    })
    return this
  }

  /**
   * @description Resolves a service from the dependency injection container.
   * @param token The injection token used to identify the service.
   * @returns The resolved service instance.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public resolve<T>(token: InjectionToken<T>): T {
    return this._container.resolve(token)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Finalizes the configuration and initializes all registered modules in the container.
   * @returns The fully configured ServiceContainer.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  public async build(): Promise<IServiceContainer> {
    for (const queued of this._modules) {
      try {
        // If in the future you want to add a debug log for each module:
        // console.log(`[AppBuilder] Initializing module: ${queued.name}...`);
        await queued.action()
      } catch (error) {
        // 1. Extract the error message safely
        const errorMessage = error instanceof Error ? error.message : String(error)

        // 2. Direct output for the developer in the terminal
        console.error(`\n❌ [AppBuilder Fatal Error]`)
        console.error(`An error occurred while initializing the module:`)
        console.error(`👉 Module: **${queued.name}**`)
        console.error(`📝 Reason: ${errorMessage}\n`)

        // If the error has a useful stack trace, print it for debugging
        if (error instanceof Error && Guards.isDefined(error.stack)) {
          console.error(error.stack)
        }

        // 3. Throw a descriptive exception to halt execution (Graceful Shutdown pre-start)
        throw new Error(`Bootstrap failed at [${queued.name}]: ${errorMessage}`, { cause: error })
      }
    }

    return this._container
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Private Helper Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Queues the configuration of the CQRS pipeline module if it has not already been queued. This method ensures that the pipeline module is only added once, even if multiple pipeline-related configurations are made.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  private _queuePipelineModule(): void {
    if (this._isPipelineModuleQueued) return
    this._isPipelineModuleQueued = true

    this._queueMiddlewareModule()

    this._modules.push({
      name: 'CqrsModule',
      action: async () => {
        const { CqrsModule } = await import('../modules/cqrs.module')
        const pipelineModule = new CqrsModule()
        await pipelineModule.configure(this._container, this._pipelineConfig)
      },
    })
  }

  /**
   * @description Queues the configuration of the middleware module if it has not already been queued. This method ensures that the middleware module is only added once, even if multiple middleware-related configurations are made.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  private _queueMiddlewareModule(): void {
    if (this._isMiddlewareModuleQueued) return
    this._isMiddlewareModuleQueued = true

    this._queueContextModule()

    this._modules.push({
      name: 'MiddlewareModule',
      action: async () => {
        const { MiddlewareModule } = await import('../modules/middleware.module')
        const middlewareModule = new MiddlewareModule()
        await middlewareModule.configure(this._container)
      },
    })
  }

  /**
   * @description Queues the configuration of the context module if it has not already been queued. This method ensures that the context module is only added once, even if multiple context-related configurations are made.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  private _queueContextModule(): void {
    if (this._isContextModuleQueued) return
    this._isContextModuleQueued = true

    this._modules.push({
      name: 'ContextModule',
      action: async () => {
        const { ContextModule } = await import('../modules/context.module')
        const contextModule = new ContextModule()
        await contextModule.configure(this._container)
      },
    })
  }
}
