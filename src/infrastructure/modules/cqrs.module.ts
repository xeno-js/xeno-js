import type { IModule, IServiceContainer } from '@/domain'

/**
 * @description CqrsModule is responsible for configuring and registering the necessary services and dependencies related to the Command Query Responsibility Segregation (CQRS) pattern in the application. It sets up the Mediator service, which acts as a central hub for handling commands and queries, allowing for a clean separation of concerns between the command and query sides of the application. By registering the Mediator in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for processing commands and queries.
 */
export class CqrsModule implements IModule<void> {
  async configure(container: IServiceContainer, opts: unknown): Promise<void> {
    const { INJECTION_TOKENS } = await import('@/infrastructure/di')

    const { Mediator } = await import('@/application/cqrs')
    container.addSingleton(INJECTION_TOKENS.MEDIATOR, Mediator, [
      INJECTION_TOKENS.SERVICE_CONTAINER,
    ])

    const { ExceptionPipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.EXCEPTION_PIPELINE, ExceptionPipeline, [])

    const { LoggingPipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.LOGGING_PIPELINE, LoggingPipeline, [
      INJECTION_TOKENS.LOGGER,
    ])

    const { PerformancePipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.PERFORMANCE_PIPELINE, PerformancePipeline, [])

    const pipelines = [
      INJECTION_TOKENS.EXCEPTION_PIPELINE,
      INJECTION_TOKENS.LOGGING_PIPELINE,
      INJECTION_TOKENS.PERFORMANCE_PIPELINE,
    ]

    if (opts === 'authorization') {
      const strategies = []

      const { TenantAuthorizationStrategy } =
        await import('@/application/cqrs/pipelines/pipeline_strategies/auth')
      container.addSingleton(
        INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE,
        TenantAuthorizationStrategy,
        [INJECTION_TOKENS.REQUEST_CONTEXT],
      )
      strategies.push(INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE)

      const { PolicyRegistry } = await import('@/application/policies')
      container.addSingleton(INJECTION_TOKENS.POLICY_REGISTRY, PolicyRegistry, [
        INJECTION_TOKENS.IN_MEMORY_CACHE,
      ])

      const { RoleAuthorizationStrategy } =
        await import('@/application/cqrs/pipelines/pipeline_strategies/auth')
      container.addSingleton(
        INJECTION_TOKENS.ROLE_AUTHORIZATION_PIPELINE,
        RoleAuthorizationStrategy,
        [INJECTION_TOKENS.REQUEST_CONTEXT],
      )
      strategies.push(INJECTION_TOKENS.ROLE_AUTHORIZATION_PIPELINE)

      const { PermissionAuthorizationStrategy } =
        await import('@/application/cqrs/pipelines/pipeline_strategies/auth')
      container.addSingleton(
        INJECTION_TOKENS.PERMISSION_AUTHORIZATION_PIPELINE,
        PermissionAuthorizationStrategy,
        [INJECTION_TOKENS.REQUEST_CONTEXT],
      )
      strategies.push(INJECTION_TOKENS.PERMISSION_AUTHORIZATION_PIPELINE)

      const { AuthorizationPipeline } = await import('@/application/cqrs/pipelines')
      container.addSingleton(
        INJECTION_TOKENS.AUTHORIZATION_PIPELINE,
        AuthorizationPipeline,
        strategies,
      )
      pipelines.push(INJECTION_TOKENS.AUTHORIZATION_PIPELINE)
    }

    const { ValidationPipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.VALIDATION_PIPELINE, ValidationPipeline, [])
    pipelines.push(INJECTION_TOKENS.VALIDATION_PIPELINE)

    const { CompositePipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.COMPOSITE_PIPELINE, CompositePipeline, pipelines)
  }
}
