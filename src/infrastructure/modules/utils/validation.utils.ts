import type { IPipelineBehavior, IRequest, IServiceContainer, IStrategy } from '@/domain'
import type { InjectionToken } from '@/shared'
import { Guards } from '@/shared'

import type { PipelineConfig } from '../config'

/**
 * @description ValidationUtils is a utility class that provides methods for adding validation strategies to the dependency injection container based on the provided configuration. It checks if the validation configuration is defined and, if so, it registers the appropriate validation strategies (such as Zod schema validation) in the container and adds them to the pipeline behaviors. This allows for flexible and configurable validation of requests in the application.
 */
export const ValidationUtils = Object.freeze({
  /**
   * @description Checks if the provided validation configuration requires any validation strategies.
   * @param validationConfig The validation configuration to check.
   * @returns True if any validation strategies are required, false otherwise.
   */

  addValidation: async (
    container: IServiceContainer,
    opts: PipelineConfig['validation'],
    pipelines: InjectionToken<IPipelineBehavior<IRequest, unknown>>[],
  ): Promise<InjectionToken<IPipelineBehavior<IRequest, unknown>>[]> => {
    if (!Guards.isDefined(opts)) return [...pipelines]

    const { INJECTION_TOKENS } = await import('@/infrastructure/di')

    const validationStrategies: InjectionToken<IStrategy<IRequest, boolean>>[] = []

    if (Guards.isDefined(opts.zod)) {
      const config = opts.zod
      const { ZodValidatorFactory } = await import('@/infrastructure/factories/')
      container.addSingletonFactory(INJECTION_TOKENS.ZOD_VALIDATOR, () => {
        return new ZodValidatorFactory().create(config)
      })

      const { SchemaValidationStrategy } = await import('@/application/cqrs/')
      container.addSingleton(
        INJECTION_TOKENS.SCHEMA_VALIDATION_STRATEGY,
        SchemaValidationStrategy,
        [INJECTION_TOKENS.ZOD_VALIDATOR],
      )
      validationStrategies.push(INJECTION_TOKENS.SCHEMA_VALIDATION_STRATEGY)
    }

    if (!Guards.isNullOrEmpty(opts.customValidationStrategy)) {
      for (const strategyToken of opts.customValidationStrategy) {
        validationStrategies.push(strategyToken)
      }
    }

    const { ValidationPipeline } = await import('@/application/cqrs/pipelines')
    container.addSingletonFactory(INJECTION_TOKENS.VALIDATION_PIPELINE, (c) => {
      const resolvedStrategies = validationStrategies.map((token) => c.resolve(token))
      return new ValidationPipeline(resolvedStrategies)
    })

    pipelines.push(INJECTION_TOKENS.VALIDATION_PIPELINE)
    return pipelines
  },
} as const)
