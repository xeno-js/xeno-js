import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { IRequest, IStrategy } from '@xeno-js/shared'
import type { ZodType } from 'zod'

import type { AuthSsrConfig, IServiceContainer, PipelineConfig } from '@/domain'
import type { XenoRegistry } from '@/infrastructure'

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

  async addAuthZ<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: PipelineConfig<TRegistry, ZodType>['authorization'],
  ): Promise<(keyof TRegistry)[]> {
    const { TOKENS } = await import('@xeno-js/shared')
    const pipelines: (keyof TRegistry)[] = []
    type StrategiesToken = keyof TRegistry
    const strategies: StrategiesToken[] = []

    const { Guards } = await import('@xeno-js/shared')
    if (Guards.isDefined(opts.policies)) {
      const { PolicyRegistry } = await import('@/application')
      container.addSingleton(TOKENS.POLICY_REGISTRY, () => new PolicyRegistry())

      const policyRegistry = opts.policies
      const registryInstance = container.resolve(TOKENS.POLICY_REGISTRY)
      const Policies = new Set<string>()
      for (const [intent, policy] of Object.entries(policyRegistry)) {
        const intentLower = intent.toLowerCase()
        registryInstance.addPolicy(intentLower, policy)

        if (!Guards.isNullOrEmpty(policy.roles)) {
          Policies.add('roles')
        }

        if (!Guards.isNullOrEmpty(policy.permissions)) {
          Policies.add('permissions')
        }

        if (!Guards.isNullOrEmpty(policy.userId)) {
          Policies.add('userId')
        }

        if (!Guards.isNullOrEmpty(policy.tenantId)) {
          Policies.add('tenantId')
        }
      }

      if (Policies.has('roles')) {
        const { RoleAuthorizationStrategy } = await import('@/application')
        container.addSingleton(
          TOKENS.ROLE_AUTHORIZATION_PIPELINE,
          (c) =>
            new RoleAuthorizationStrategy(
              c.resolve(TOKENS.POLICY_REGISTRY),
              c.resolve(TOKENS.CONTEXT_ACCESSOR),
            ),
        )
        strategies.push(TOKENS.ROLE_AUTHORIZATION_PIPELINE)
      }

      if (Policies.has('permissions')) {
        const { PermissionAuthorizationStrategy } = await import('@/application')
        container.addSingleton(
          TOKENS.PERMISSION_AUTHORIZATION_PIPELINE,
          (c) =>
            new PermissionAuthorizationStrategy(
              c.resolve(TOKENS.POLICY_REGISTRY),
              c.resolve(TOKENS.CONTEXT_ACCESSOR),
            ),
        )
        strategies.push(TOKENS.PERMISSION_AUTHORIZATION_PIPELINE)
      }

      if (Policies.has('userId')) {
        const { UserAuthorizationStrategy } = await import('@/application')
        container.addSingleton(
          TOKENS.USER_AUTHORIZATION_PIPELINE,
          (c) =>
            new UserAuthorizationStrategy(
              c.resolve(TOKENS.POLICY_REGISTRY),
              c.resolve(TOKENS.CONTEXT_ACCESSOR),
            ),
        )
        strategies.push(TOKENS.USER_AUTHORIZATION_PIPELINE)
      }

      if (Policies.has('tenantId')) {
        const { TenantAuthorizationStrategy } = await import('@/application')
        container.addSingleton(
          TOKENS.TENANT_AUTHORIZATION_PIPELINE,
          (c) =>
            new TenantAuthorizationStrategy(
              c.resolve(TOKENS.POLICY_REGISTRY),
              c.resolve(TOKENS.CONTEXT_ACCESSOR),
            ),
        )
        strategies.push(TOKENS.TENANT_AUTHORIZATION_PIPELINE)
      }
    }

    if (!Guards.isNullOrEmpty(opts.customAuthorizationStrategy)) {
      const customStrategies = opts.customAuthorizationStrategy
      customStrategies.forEach((strategyToken, index) => {
        if (Guards.isDefined(strategyToken)) {
          const token = `CUSTOM_AUTHORIZATION_STRATEGY_${index}` as keyof TRegistry

          container.addSingleton(token, (c) => {
            return strategyToken(c) as unknown as TRegistry[typeof token]
          })
          strategies.push(token)
        }
      })
    }

    const { AuthorizationPipeline } = await import('@/application')
    container.addSingleton(TOKENS.AUTHORIZATION_PIPELINE, (c) => {
      const resolvedStrategies = strategies.map(
        (strategy) => c.resolve(strategy) as unknown as IStrategy<IRequest, void>,
      )
      return new AuthorizationPipeline(resolvedStrategies)
    })
    pipelines.push(TOKENS.AUTHORIZATION_PIPELINE)
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
  async addAuthN<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: AuthSsrConfig<SupabaseClientOptions<'public'>>,
  ): Promise<void> {
    const { TOKENS } = await import('@xeno-js/shared')
    const _t = opts
    const { SupabaseServerAuthFactory } = await import('../../factories')
    container.addScoped(TOKENS.AUTH_SERVICE, () => {
      const factory = new SupabaseServerAuthFactory()
      return factory.create({ config: opts, container })
    })

    container.addSingleton(TOKENS.BASE_AUTH_SERVICE, () => {
      const factory = new SupabaseServerAuthFactory()
      return factory.create({ config: opts, container })
    })

    const { ClaimsIdentityMapper } = await import('@/application')
    container.addSingleton(TOKENS.CLAIMS_IDENTITY_MAPPER, () => new ClaimsIdentityMapper())

    const { GateKeeper } = await import('@/application')
    container.addSingleton(TOKENS.GATE_KEEPER, (c) => {
      return new GateKeeper(
        c.resolve(TOKENS.BASE_AUTH_SERVICE),
        c.resolve(TOKENS.CLAIMS_IDENTITY_MAPPER),
      )
    })
  },
} as const)
