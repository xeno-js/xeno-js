import type {
  CacheConfig,
  Dictionary,
  IConfigurationService,
  Nullable,
  SetupAction,
} from '@xeno-js/shared'
import { Guards, LOG_LEVEL, TOKENS } from '@xeno-js/shared'

import type {
  ApplicationRegistry,
  AuthSsrConfig,
  HttpAdapterConfig,
  HttpCoreConfig,
  IModule,
  IServiceContainer,
  LoggerConfig,
  MiddlewareConfig,
  PipelineConfig,
} from '@/domain'

import { EnvironmentConfigurationService } from '../configuration'
import { ServiceContainer } from '../container/service-container'

/**
 * @description The AppBuilder class provides a fluent, .NET-style API for configuring and bootstrapping the application. It orchestrates the registration of various modules (CQRS, HTTP, Database, Logging, Auth) into the ServiceContainer.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
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
   * @link https://github.com/xeno-js/xeno-js 
   */
export class AppBuilder<TRegistry extends ApplicationRegistry = ApplicationRegistry> {
  protected readonly _container: IServiceContainer<TRegistry> = new ServiceContainer<TRegistry>()
  protected readonly _configuration: IConfigurationService
  private _buildPromise: Nullable<Promise<IServiceContainer<TRegistry>>> = null

  constructor(
    container?: IServiceContainer<TRegistry>,
    configurationService?: IConfigurationService,
  ) {
    this._container = container ?? new ServiceContainer<TRegistry>()

    this._configuration = configurationService ?? new EnvironmentConfigurationService()
    this._container.addSingleton(TOKENS.CONFIGURATION_SERVICE, () => this._configuration)

    this.addContext()
  }

  // --- Module Configurations ---
  protected readonly _modules: QueuedModule[] = []

  // --- Specific Configurations ---
  private _adapterConfig: HttpAdapterConfig = {
    native: true,
    vercel: false,
    fastify: false,
    custom: undefined,
  }
  private _pipelineConfig: PipelineConfig<TRegistry, Dictionary> = {
    performance: { thresholdMs: 500, intentThresholdMs: undefined },
    authorization: {
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
  private _config: CacheConfig = { inMemory: true, redis: undefined }
  private _middlewareConfig: MiddlewareConfig = {
    isSSR: false,
    rateLimite: {
      maxRequests: 3,
      windowSeconds: 100,
    },
    csrf: undefined,
    optionsMiddleware: false,
    routeRegistry: undefined,
    trustedIpHeader: undefined,
    trustedProxies: [],
    allowOrigins: [],
    allowHeaders: [],
    cors: true,
    withCredentials: true,
    authCookieName: 'sb-access-token',
  }
  private readonly _authConfig: AuthSsrConfig<Dictionary> = {
    url: '',
    key: '',
    opts: undefined,
    redirectTo: '',
    storageOpts: { type: 'memory', cookieOpts: undefined, storage: undefined },
    ssrOpts: undefined,
    customAuth: undefined,
    cookieOpts: {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    },
  }
  private readonly _httpConfig: HttpCoreConfig<TRegistry> = {
    dataSourceToken: undefined,
    http: {
      token: undefined,
      client: {
        defaultHeaders: undefined,
        baseURL: undefined,
        timeoutMs: undefined,
        keepAlive: undefined,
        maxSockets: undefined,
        maxRedirects: undefined,
        decompress: undefined,
        withCredentials: undefined,
        proxy: false,
      },
    },
    resilience: { retry: {}, circuitBreaker: {}, bulkhead: {} },
  } as unknown as HttpCoreConfig<TRegistry>
  private readonly _loggerConfig = {
    level: LOG_LEVEL.DEBUG,
    console: true,
    sentry: { config: undefined },
    pino: { config: undefined },
    customLoggers: undefined,
  } as unknown as LoggerConfig<ApplicationRegistry<unknown>>

  // --- Module Queuing Flags ---
  private _isContextModuleQueued = false
  private _isMiddlewareModuleQueued = false
  private _isPipelineModuleQueued = false
  private _isLoggerModuleQueued = false
  private _isAuthModuleQueued = false
  private _isDbContextModuleQueued = false
  private _isConcurrencyServiceQueued = false
  private _isCacheModuleQueued = false
  private _isAdapterModuleQueued = false

  // ─────────────────────────────────────────────────────────────────────────────
  // Application Modules Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  protected addAdapter(setupAction: SetupAction<HttpAdapterConfig, IConfigurationService>): this {
    if (this._isAdapterModuleQueued) return this
    setupAction(this._adapterConfig, this._configuration)
    this._isAdapterModuleQueued = true

    this._modules.push({
      priority: 3,
      name: 'AdapterModule',
      action: async () => {
        const { HttpAdapterModule } = await import('../modules/http-adapter.module')
        await new HttpAdapterModule().configure(this._container, this._adapterConfig)
      },
    })
    return this
  }

  /**
   * @description Enables the use of middlewares in the application. Middlewares can be used for cross-cutting concerns such as logging, authentication, and request/response manipulation.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
  public addMiddlewares(setupAction: SetupAction<MiddlewareConfig, IConfigurationService>): this {
    setupAction(this._middlewareConfig, this._configuration)
    this._queueMiddlewareModule()
    return this
  }

  /**
   * @description Enables the use of context in the application. Context can be used to store and manage request-specific data, such as user information, correlation IDs, and other metadata that needs to be accessible throughout the request lifecycle.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
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
   * @link https://github.com/xeno-js/xeno-js
   */
  public addLogger(
    setupAction?: SetupAction<LoggerConfig<TRegistry>, IConfigurationService>,
  ): this {
    if (Guards.isDefined(setupAction)) setupAction(this._loggerConfig, this._configuration)

    if (this._isLoggerModuleQueued) return this
    this._isLoggerModuleQueued = true

    this._modules.push({
      priority: 1,
      name: 'LoggerModule',
      action: async () => {
        const { LoggerUtils } = await import('../modules/utils/logger.utils')
        await LoggerUtils.addLogger(this._container, this._loggerConfig)
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
   * @link https://github.com/xeno-js/xeno-js 
   */
  public addCache(setupAction?: SetupAction<CacheConfig, IConfigurationService>): this {
    if (Guards.isDefined(setupAction)) setupAction(this._config, this._configuration)

    if (this._isCacheModuleQueued) return this
    this._isCacheModuleQueued = true

    this._modules.push({
      priority: 2,
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
   * @link https://github.com/xeno-js/xeno-js 
   */
  public addAuth(setupAction: SetupAction<AuthSsrConfig, IConfigurationService>): this {
    if (this._isAuthModuleQueued) return this
    this._isAuthModuleQueued = true

    setupAction(this._authConfig, this._configuration)
    this._modules.push({
      priority: 3,
      name: 'AuthModule',
      action: async () => {
        const { AuthUtils } = await import('../modules/utils/auth.utils')
        await AuthUtils.addAuthN(this._container, this._authConfig)
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
   * @link https://github.com/xeno-js/xeno-js 
   */
  public addDb(plugin: (builder: this, config: IConfigurationService) => this): this {
    if (this._isDbContextModuleQueued) return this
    const result = plugin(this, this._configuration)
    this._isDbContextModuleQueued = true
    return result
  }

  /**
   * @description Enables the use of the service for concurrency control in the application. This method allows you to limit the number of concurrent asynchronous tasks being executed, which is useful for managing system resources and preventing event loop blocking during massive batch operations.
   * @returns The current instance of AppBuilder for method chaining.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
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
   * @link https://github.com/xeno-js/xeno-js 
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
   * @link https://github.com/xeno-js/xeno-js 
   */
  public addHttpCore(
    setupAction: SetupAction<HttpCoreConfig<TRegistry>, IConfigurationService>,
  ): this {
    setupAction(this._httpConfig, this._configuration)
    this._modules.push({
      priority: 30,
      name: 'HttpCoreModule',
      action: async () => {
        const { HttpCoreModule } = await import('../modules/http-core.module')
        const coreModule = new HttpCoreModule<TRegistry>()
        await coreModule.configure(this._container, this._httpConfig)
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
   * @link https://github.com/xeno-js/xeno-js
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
   * @link https://github.com/xeno-js/xeno-js
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
   * @link https://github.com/xeno-js/xeno-js
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
   * @link https://github.com/xeno-js/xeno-js
   */
  public async build(): Promise<IServiceContainer<TRegistry>> {
    if (Guards.isDefined(this._buildPromise)) return this._buildPromise

    this._buildPromise = this._executeBuild()

    return this._buildPromise
  }

  /**
   * @description Executes the build process by initializing all registered modules in the container.
   */
  private async _executeBuild(): Promise<IServiceContainer<TRegistry>> {
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
   * @link https://github.com/xeno-js/xeno-js
   */
  private _queuePipelineModule(): void {
    if (this._isPipelineModuleQueued) return
    this._isPipelineModuleQueued = true

    this._queueContextModule()

    if (!this._isLoggerModuleQueued) this.addLogger()
    if (!this._isCacheModuleQueued) this.addCache()

    this._modules.push({
      priority: 5,
      name: 'CqrsModule',
      action: async () => {
        const { CqrsModule } = await import('../modules/cqrs.module')
        const pipelineModule = new CqrsModule<TRegistry>()
        await pipelineModule.configure(this._container, this._pipelineConfig)
      },
    })
  }

  /**
   * @description Queues the configuration of the middleware module if it has not already been queued. This method ensures that the middleware module is only added once, even if multiple middleware-related configurations are made.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  private _queueMiddlewareModule(): void {
    if (this._isMiddlewareModuleQueued) return
    this._isMiddlewareModuleQueued = true

    this._queueContextModule()

    if (!this._isLoggerModuleQueued) this.addLogger()
    if (!this._isCacheModuleQueued) this.addCache()

    this._modules.push({
      priority: 4,
      name: 'MiddlewareModule',
      action: async () => {
        const { MiddlewareModule } = await import('../modules/middleware.module')
        const middlewareModule = new MiddlewareModule()
        if (!this._isAdapterModuleQueued) {
          const { HttpAdapterModule } = await import('../modules/http-adapter.module')
          await new HttpAdapterModule().configure(this._container, this._adapterConfig)
        }

        await middlewareModule.configure(this._container, {
          ...this._middlewareConfig,
          isAuth: this._isAuthModuleQueued,
          customTokenExtractor: this._authConfig.customAuth?.authHeaderExtractor,
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
   * @link https://github.com/xeno-js/xeno-js 
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
