import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { IPipelineBehavior, IRequest, IStrategy } from '@xeno-js/shared'
import type { ZodType } from 'zod'

import type { AuthSsrConfig, IServiceContainer, PipelineConfig } from '@/domain'
import type { XenoRegistry } from '@/infrastructure'

/**
 *  @description Utility functions for configuring authentication and authorization in the service container.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
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
   * @link https://github.com/xeno-js/xeno-js 
   */

  async addAuthZ<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: PipelineConfig<TRegistry, ZodType>['authorization'],
  ): Promise<IPipelineBehavior<IRequest<unknown>, unknown>> {
    const { TOKENS } = await import('@xeno-js/shared')
    const strategies: IStrategy<IRequest>[] = []

    const { Guards } = await import('@xeno-js/shared')
    if (Guards.isDefined(opts.policies)) {
      const { PolicyRegistry } = await import('@/application')

      const policyRegistry = opts.policies
      const registryInstance = new PolicyRegistry()
      const ctxAccessor = container.resolve(TOKENS.CONTEXT_ACCESSOR)
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
        strategies.push(new RoleAuthorizationStrategy(registryInstance, ctxAccessor))
      }

      if (Policies.has('permissions')) {
        const { PermissionAuthorizationStrategy } = await import('@/application')
        strategies.push(new PermissionAuthorizationStrategy(registryInstance, ctxAccessor))
      }

      if (Policies.has('userId')) {
        const { UserAuthorizationStrategy } = await import('@/application')
        strategies.push(new UserAuthorizationStrategy(registryInstance, ctxAccessor))
      }

      if (Policies.has('tenantId')) {
        const { TenantAuthorizationStrategy } = await import('@/application')
        strategies.push(new TenantAuthorizationStrategy(registryInstance, ctxAccessor))
      }
    }

    if (!Guards.isNullOrEmpty(opts.customAuthorizationStrategy)) {
      const customStrategies = opts.customAuthorizationStrategy
      customStrategies.forEach((strategyToken) => {
        if (Guards.isDefined(strategyToken)) {
          strategies.push(strategyToken(container))
        }
      })
    }

    const { AuthorizationPipeline } = await import('@/application')
    return new AuthorizationPipeline(strategies)
  },

  /**
   * @description Configures the authentication service and gatekeeper in the service container.
   * @param container The service container to configure.
   * @param opts The authentication configuration options.
   
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
  async addAuthN<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: AuthSsrConfig<SupabaseClientOptions<'public'>>,
  ): Promise<void> {
    const { TOKENS } = await import('@xeno-js/shared')
    const _t = opts
    const { SupabaseServerAuthFactory } = await import('../../factories')

    const factory = new SupabaseServerAuthFactory()
    const supabase = factory.create({ config: opts, container })
    container.addScoped(TOKENS.AUTH_SERVICE, () => {
      return supabase
    })

    container.addSingleton(TOKENS.BASE_AUTH_SERVICE, () => {
      return supabase
    })
  },
} as const)
