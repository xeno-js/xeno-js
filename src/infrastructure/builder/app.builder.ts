import type { ZodType } from 'zod'

import type {
  ApplicationRegistry,
  AuthClientConfig,
  CacheConfig,
  DbConfig,
  HttpCoreConfig,
  IConfigurationService,
  IModule,
  IServiceContainer,
  LoggerConfig,
  MiddlewareConfig,
  PipelineConfig,
} from '@/domain'
import type { Optional, SetupAction } from '@/shared'
import { Guards, LOG_LEVEL, TOKENS } from '@/shared'

import { EnvironmentConfigurationService } from '../configuration'
import { ServiceContainer } from '../container/service-container'
import type { XenoRegistry } from '../xeno-registry'

/**
 * @description The AppBuilder class provides a fluent, .NET-style API for configuring and bootstrapping the application. It orchestrates the registration of various modules (CQRS, HTTP, Database, Logging, Auth) into the ServiceContainer.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
interface QueuedModule {
  priority: number
  name: string
  action: () => Promise<void>
}

/**
 * @description The AppBuilder class provides a fluent, .NET-style API for configuring and bootstrapping the application.
 * It orchestrates the registration of various modules (CQRS, HTTP, Database, Logging, Auth) into the ServiceContainer.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class AppBuilder<TRegistry extends XenoRegistry = XenoRegistry> {
  private readonly _container: IServiceContainer<TRegistry> = new ServiceContainer<TRegistry>()
  private readonly _configuration: IConfigurationService

  constructor(container?: IServiceContainer<TRegistry>) {
    this._container = container ?? new ServiceContainer<TRegistry>()

    this._container.addSingleton(
      TOKENS.CONFIGURATION_SERVICE,
      () => new EnvironmentConfigurationService(),
    )
    this._configuration = this._container.resolve(TOKENS.CONFIGURATION_SERVICE)
  }

  // --- Module Configurations ---
  private readonly _modules: QueuedModule[] = []

  // --- Specific Configurations ---
  private _pipelineConfig: PipelineConfig<TRegistry, ZodType> = {
    performance: { thresholdMs: 500 },
    authorization: {
      userId: false,
      tenantId: false,
      policies: undefined,
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
  private _middlewareConfig: MiddlewareConfig = { publicRoutes: undefined }
  private _config: CacheConfig = { inMemory: true, redis: undefined }

  // --- Module Queuing Flags ---
  private _isContextModuleQueued = false
  private _isMiddlewareModuleQueued = false
  private _isPipelineModuleQueued = false
  private _isLoggerModuleQueued = false
  private _isAuthModuleQueued = false
  private _isDbContextModuleQueued = false
  private _isConcurrencyServiceQueued = false
  private _isCacheModuleQueued = false

  // ─────────────────────────────────────────────────────────────────────────────
  // Application Modules Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Enables the use of middlewares in the application. Middlewares can be used for cross-cutting concerns such as logging, authentication, and request/response manipulation.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addMiddlewares(setupAction?: SetupAction<MiddlewareConfig, IConfigurationService>): this {
    if (Guards.isDefined(setupAction)) setupAction(this._middlewareConfig, this._configuration)

    this._queueMiddlewareModule(this._middlewareConfig)
    return this
  }

  /**
   * @description Enables the use of context in the application. Context can be used to store and manage request-specific data, such as user information, correlation IDs, and other metadata that needs to be accessible throughout the request lifecycle.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addLogger(
    setupAction?: SetupAction<LoggerConfig<TRegistry>, IConfigurationService>,
  ): this {
    if (this._isLoggerModuleQueued) return this
    this._isLoggerModuleQueued = true
    const config = {
      level: LOG_LEVEL.DEBUG,
      console: true,
      sentry: { config: undefined },
      pino: { config: undefined },
      customLoggers: undefined,
    } as unknown as Optional<LoggerConfig<ApplicationRegistry<unknown>>>
    if (Guards.isDefined(setupAction) && Guards.isDefined(config))
      setupAction(config, this._configuration)

    this._modules.push({
      priority: 3,
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addCache(setupAction?: SetupAction<CacheConfig, IConfigurationService>): this {
    if (this._isCacheModuleQueued) return this
    this._isCacheModuleQueued = true
    if (Guards.isDefined(setupAction)) setupAction(this._config, this._configuration)

    this._modules.push({
      priority: 3,
      name: 'CacheModule',
      action: async () => {
        const { CacheUtils } = await import('../modules/utils/cache.utils')
        await CacheUtils.addCache(this._container, this._config)
      },
    })
    return this
  }

  /**
   * @description Configures the authentication client for the application. This method allows you to set up authentication options such as the authentication server URL, API key, and additional options.
   * @param setupAction A callback function that receives an AuthClientConfig object to configure the authentication client settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addAuth(
    setupAction: SetupAction<AuthClientConfig<TRegistry>, IConfigurationService>,
  ): this {
    if (this._isAuthModuleQueued) return this
    this._isAuthModuleQueued = true
    const config = { url: '', key: '', options: undefined, customAuthService: undefined }
    setupAction(config, this._configuration)
    this._modules.push({
      priority: 2,
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addDb(setupAction: SetupAction<DbConfig, IConfigurationService>): this {
    if (this._isDbContextModuleQueued) return this
    this._isDbContextModuleQueued = true
    const config = { connectionString: '' }
    setupAction(config, this._configuration)
    this._modules.push({
      priority: 4,
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addConcurrencyService(): this {
    if (this._isConcurrencyServiceQueued) return this
    this._isConcurrencyServiceQueued = true
    this._modules.push({
      priority: 40,
      name: 'ConcurrencyServiceModule',
      action: async () => {
        const { PLimitConcurrencyService } = await import('../services/concurrency')
        this._container.addSingleton('CONCURRENCY_SERVICE', () => new PLimitConcurrencyService())
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addPipeline(
    setupAction?: SetupAction<PipelineConfig<TRegistry>, IConfigurationService>,
  ): this {
    if (Guards.isDefined(setupAction)) {
      setupAction(this._pipelineConfig, this._configuration)
    }
    this._queuePipelineModule()
    return this
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HTTP & Resilience Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Configures the HTTP core settings for the application. This method allows you to set up HTTP core options such as data source token, HTTP client configuration, and resilience settings.
   * @param setupAction A callback function that receives an HttpCoreConfig object to configure the HTTP core settings.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addHttpCore(
    setupAction: SetupAction<HttpCoreConfig<TRegistry>, IConfigurationService>,
  ): this {
    const config = {
      dataSourceToken: undefined as unknown,
      http: { token: undefined as unknown, client: {} },
      resilience: { retry: {}, circuitBreaker: {}, bulkhead: {} },
    } as unknown as HttpCoreConfig<TRegistry>
    setupAction(config, this._configuration)
    this._modules.push({
      priority: 30,
      name: 'HttpCoreModule',
      action: async () => {
        const { HttpCoreModule } = await import('../modules/http-core.module')
        const coreModule = new HttpCoreModule<TRegistry>()
        await coreModule.configure(this._container, config)
      },
    })
    return this
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Dependency Injection Pass-through Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Registers services in the application. This method allows you to add custom services to the dependency injection container, enabling modular and organized configuration of services.
   * @param setupAction A callback function that receives the IServiceContainer to register services.
   * @returns The current instance of AppBuilder for method chaining.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public addServices(
    setupAction: SetupAction<IServiceContainer<TRegistry>, IConfigurationService>,
  ): this {
    this._modules.push({
      priority: 99,
      name: 'ClientServicesModule',
      action: async () => {
        setupAction(this._container, this._configuration)
      },
    })
    return this
  }

  /**
   * @description Registers a module in the application. A module is a self-contained unit of functionality that can configure services and dependencies in the service container. This method allows you to add custom modules to the application, enabling modular and organized configuration of services.
   * @param factory A factory function that creates the module instance.
   * @param opts Optional configuration options for the module.
   * @returns The current instance of AppBuilder for method chaining.
   *
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public addModule<T>(name: string, factory: () => Promise<IModule<TRegistry, T>>, opts?: T): this {
    this._modules.push({
      priority: 50,
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public resolve<K extends keyof TRegistry>(token: K): TRegistry[K] {
    return this._container.resolve(token)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Finalizes the configuration and initializes all registered modules in the container.
   * @returns The fully configured ServiceContainer.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public async build(): Promise<IServiceContainer<TRegistry>> {
    console.info('⚙️ Bootstrapping application modules...')
    const sortedModules = this._modules.sort((a, b) => a.priority - b.priority)
    for (const queued of sortedModules) {
      try {
        await queued.action()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)

        console.error(`\n❌ [AppBuilder Fatal Error]`)
        console.error(`An error occurred while initializing the module:`)
        console.error(`👉 Module: **${queued.name}**`)
        console.error(`📝 Reason: ${errorMessage}\n`)

        if (error instanceof Error && Guards.isDefined(error.stack)) {
          console.error(error.stack)
        }

        throw new Error(`Bootstrap failed at [${queued.name}]: ${errorMessage}`, { cause: error })
      }
    }
    console.info('✅ Application modules bootstrapped successfully.')
    return this._container
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Private Helper Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @description Queues the configuration of the CQRS pipeline module if it has not already been queued. This method ensures that the pipeline module is only added once, even if multiple pipeline-related configurations are made.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private _queuePipelineModule(): void {
    if (this._isPipelineModuleQueued) return
    this._isPipelineModuleQueued = true

    this._queueContextModule()

    this._modules.push({
      priority: 5,
      name: 'CqrsModule',
      action: async () => {
        const { CqrsModule } = await import('../modules/cqrs.module')
        const pipelineModule = new CqrsModule<TRegistry>()
        await pipelineModule.configure(this._container, {
          ...this._pipelineConfig,
          isLogger: this._isLoggerModuleQueued || this._isMiddlewareModuleQueued,
          isCache: !this._isCacheModuleQueued,
        })
      },
    })
  }

  /**
   * @description Queues the configuration of the middleware module if it has not already been queued. This method ensures that the middleware module is only added once, even if multiple middleware-related configurations are made.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private _queueMiddlewareModule(opts: MiddlewareConfig): void {
    if (this._isMiddlewareModuleQueued) return
    this._isMiddlewareModuleQueued = true

    this._queueContextModule()

    this._modules.push({
      priority: 3,
      name: 'MiddlewareModule',
      action: async () => {
        const { MiddlewareModule } = await import('../modules/middleware.module')
        const middlewareModule = new MiddlewareModule()
        await middlewareModule.configure(this._container, {
          ...opts,
          isAuth: this._isAuthModuleQueued,
          isLogger: this._isLoggerModuleQueued,
        })
      },
    })
  }

  /**
   * @description Queues the configuration of the context module if it has not already been queued. This method ensures that the context module is only added once, even if multiple context-related configurations are made.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private _queueContextModule(): void {
    if (this._isContextModuleQueued) return
    this._isContextModuleQueued = true

    this._modules.push({
      priority: 0,
      name: 'ContextModule',
      action: async () => {
        const { ContextModule } = await import('../modules/context.module')
        const contextModule = new ContextModule<TRegistry>()
        await contextModule.configure(this._container)
      },
    })
  }
}
