import type { IModule, IServiceContainer } from '@/domain'

/**
 * @description CqrsModule is responsible for configuring and registering the necessary services and dependencies related to the Command Query Responsibility Segregation (CQRS) pattern in the application. It sets up the Mediator service, which acts as a central hub for handling commands and queries, allowing for a clean separation of concerns between the command and query sides of the application. By registering the Mediator in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for processing commands and queries.
 */
export class CqrsModule implements IModule<void> {
  async configure(container: IServiceContainer): Promise<void> {
    const { INJECTION_TOKENS } = await import('@/domain/tokens')

    const { Mediator } = await import('@/application/cqrs')
    container.addSingleton(INJECTION_TOKENS.MEDIATOR, Mediator, [
      INJECTION_TOKENS.SERVICE_CONTAINER,
    ])
  }
}
