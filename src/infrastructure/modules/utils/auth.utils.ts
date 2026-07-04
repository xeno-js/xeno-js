import type { IPipelineBehavior, IRequest, IServiceContainer } from '@/domain'
import type { InjectionToken } from '@/shared'
import { Guards } from '@/shared'

import type { AuthClientConfig, PipelineConfig } from '../config'

/**
 *  @description Utility functions for configuring authentication and authorization in the service container.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const AuthUtils = Object.freeze({
  /**
   * @description Checks if the provided authorization configuration requires any authorization strategies.
   * @param authorizationConfig The authorization configuration to check.
   * @returns True if any authorization strategies are required, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

  addAuthZ: async (
    container: IServiceContainer,
    opts: PipelineConfig['authorization'],
  ): Promise<InjectionToken<IPipelineBehavior<IRequest, unknown>>[]> => {
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')
    const pipelines: InjectionToken<IPipelineBehavior<IRequest, unknown>>[] = []
    const strategies = []

    const { UserAuthorizationStrategy } = await import('@/application')
    container.addSingleton(
      INJECTION_TOKENS.USER_AUTHORIZATION_PIPELINE,
      UserAuthorizationStrategy,
      [INJECTION_TOKENS.REQUEST_CONTEXT],
    )

    if (opts.tenant) {
      const { TenantAuthorizationStrategy } = await import('@/application')
      container.addSingleton(
        INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE,
        TenantAuthorizationStrategy,
        [INJECTION_TOKENS.REQUEST_CONTEXT],
      )
    }

    if (opts.policy.permission || opts.policy.role) {
      if (!Guards.isDefined(opts.policy.policyRegistry)) {
        throw new Error(
          'Policy registry must be provided when role or permission based authorization is enabled.',
        )
      }

      const { PolicyRegistry } = await import('@/application')
      container.addSingleton(INJECTION_TOKENS.POLICY_REGISTRY, PolicyRegistry, [])

      const policyRegistry = opts.policy.policyRegistry
      const registryInstance = container.resolve(INJECTION_TOKENS.POLICY_REGISTRY)
      for (const [intent, policy] of Object.entries(policyRegistry)) {
        registryInstance.addPolicy(intent, policy)
      }

      if (opts.policy.role) {
        const { RoleAuthorizationStrategy } = await import('@/application')
        container.addSingleton(
          INJECTION_TOKENS.ROLE_AUTHORIZATION_PIPELINE,
          RoleAuthorizationStrategy,
          [INJECTION_TOKENS.REQUEST_CONTEXT],
        )
        strategies.push(INJECTION_TOKENS.ROLE_AUTHORIZATION_PIPELINE)
      }

      if (opts.policy.permission) {
        const { PermissionAuthorizationStrategy } = await import('@/application')
        container.addSingleton(
          INJECTION_TOKENS.PERMISSION_AUTHORIZATION_PIPELINE,
          PermissionAuthorizationStrategy,
          [INJECTION_TOKENS.REQUEST_CONTEXT],
        )
        strategies.push(INJECTION_TOKENS.PERMISSION_AUTHORIZATION_PIPELINE)
      }
    }

    if (!Guards.isNullOrEmpty(opts.customAuthorizationStrategy)) {
      const customStrategies = opts.customAuthorizationStrategy
      for (const strategy of customStrategies) {
        strategies.push(strategy)
      }
    }

    const { AuthorizationPipeline } = await import('@/application')
    const resolvedStrategies = strategies.map((strategy) => container.resolve(strategy))
    container.addSingletonFactory(INJECTION_TOKENS.AUTHORIZATION_PIPELINE, () => {
      return new AuthorizationPipeline(resolvedStrategies)
    })
    pipelines.push(INJECTION_TOKENS.AUTHORIZATION_PIPELINE)
    return pipelines
  },

  /**
   * @description Configures the authentication service and gatekeeper in the service container.
   * @param container The service container to configure.
   * @param opts The authentication configuration options.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  addAuthN: async (container: IServiceContainer, opts: AuthClientConfig): Promise<void> => {
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')

    if (Guards.isDefined(opts.customAuthService)) {
      container.addSingletonFactory(INJECTION_TOKENS.AUTH_SERVICE, () => {
        return container.resolve(opts.customAuthService!)
      })
    } else {
      const { SupabaseAuthServiceFactory } = await import('../../factories/supabase-auth.factory')
      container.addSingletonFactory(INJECTION_TOKENS.AUTH_SERVICE, () => {
        const factory = new SupabaseAuthServiceFactory()
        return factory.create(opts)
      })

      const { ClaimsIdentityMapper } = await import('@/application')
      container.addSingleton(INJECTION_TOKENS.CLAIMS_IDENTITY_MAPPER, ClaimsIdentityMapper, [])
    }

    const { GateKeeper } = await import('@/application')
    container.addSingleton(INJECTION_TOKENS.GATE_KEEPER, GateKeeper, [
      INJECTION_TOKENS.AUTH_SERVICE,
      INJECTION_TOKENS.CLAIMS_IDENTITY_MAPPER,
    ])
  },
} as const)
