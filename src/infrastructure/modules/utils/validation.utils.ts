import type { ILogger, IRequest, IStrategy } from '@xeno-js/shared'
import type { KeysOfType } from '@xeno-js/shared'
import type { ZodType } from 'zod'

import type {
  ApplicationRegistry,
  IServiceContainer,
  IServiceScope,
  PipelineConfig,
} from '@/domain'

import type { XenoRegistry } from '../../xeno-registry'

/**
 * @description ValidationUtils is a utility class that provides methods for adding validation strategies to the dependency injection container based on the provided configuration. It checks if the validation configuration is defined and, if so, it registers the appropriate validation strategies (such as Zod schema validation) in the container and adds them to the pipeline behaviors. This allows for flexible and configurable validation of requests in the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const ValidationUtils = Object.freeze({
  /**
   * @description Checks if the provided validation configuration requires any validation strategies.
   * @param validationConfig The validation configuration to check.
   * @returns True if any validation strategies are required, false otherwise.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */

  async addValidation<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: PipelineConfig<TRegistry, ZodType>['validation'],
    logger: ILogger,
  ): Promise<(keyof TRegistry)[]> {
    const { Guards, TOKENS } = await import('@xeno-js/shared')

    if (!Guards.isDefined(opts.zod) && Guards.isNullOrEmpty(opts.customValidationStrategy)) {
      return []
    }

    const pipelines: (keyof TRegistry)[] = []
    const validationStrategies: KeysOfType<
      ApplicationRegistry<unknown>,
      IStrategy<IRequest, boolean>
    >[] = []

    if (Guards.isDefined(opts.zod)) {
      const config = opts.zod
      const { ZodValidatorFactory } = await import('../../factories/zod-validator.factory')
      container.addSingleton(TOKENS.ZOD_VALIDATOR, () => {
        return new ZodValidatorFactory().create({ ...config, logger })
      })

      const { SchemaValidationStrategy } = await import('@/application')
      container.addSingleton(
        TOKENS.SCHEMA_VALIDATION_STRATEGY,
        (c) => new SchemaValidationStrategy(c.resolve(TOKENS.ZOD_VALIDATOR)),
      )
      validationStrategies.push(TOKENS.SCHEMA_VALIDATION_STRATEGY)
    }
    const customValidationFactory: ((
      c: IServiceScope<TRegistry>,
    ) => IStrategy<IRequest, boolean>)[] = []

    if (!Guards.isNullOrEmpty(opts.customValidationStrategy)) {
      for (const strategyToken of opts.customValidationStrategy) {
        if (Guards.isDefined(strategyToken)) {
          customValidationFactory.push(strategyToken)
        }
      }
    }

    const { ValidationPipeline } = await import('@/application')
    container.addSingleton(TOKENS.VALIDATION_PIPELINE, (c) => {
      const resolvedStrategies = [
        ...validationStrategies.map((token) => c.resolve(token)),
        ...customValidationFactory.map((factory) => factory(c)),
      ]
      return new ValidationPipeline(resolvedStrategies)
    })

    pipelines.push(TOKENS.VALIDATION_PIPELINE)
    return pipelines
  },
} as const)
