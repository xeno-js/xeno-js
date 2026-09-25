import type { ILogger, IPipelineBehavior, IRequest, IStrategy, Optional } from '@xeno-js/shared'
import type { ZodType } from 'zod'

import type { IServiceContainer, PipelineConfig } from '@/domain'

import type { XenoRegistry } from '../../xeno-registry'

/**
 * @description ValidationUtils is a utility class that provides methods for adding validation strategies to the dependency injection container based on the provided configuration. It checks if the validation configuration is defined and, if so, it registers the appropriate validation strategies (such as Zod schema validation) in the container and adds them to the pipeline behaviors. This allows for flexible and configurable validation of requests in the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
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
   * @link https://github.com/xeno-js/xeno-js
   */

  async addValidation<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: PipelineConfig<TRegistry, ZodType>['validation'],
    logger: ILogger,
  ): Promise<Optional<IPipelineBehavior<IRequest<unknown>, unknown>>> {
    const { Guards, TOKENS } = await import('@xeno-js/shared')
    if (!Guards.isDefined(opts.zod) && Guards.isNullOrEmpty(opts.customValidationStrategy)) {
      return
    }

    const validationStrategies: IStrategy<IRequest, boolean>[] = []

    if (Guards.isDefined(opts.zod)) {
      const config = opts.zod
      const { ZodValidatorFactory } = await import('../../factories')
      const { SchemaValidationStrategy } = await import('@/application')
      const validatorService = new ZodValidatorFactory().create({ ...config, logger })
      container.addSingleton(TOKENS.VALIDATOR_SERVICE, () => validatorService)
      validationStrategies.push(new SchemaValidationStrategy(validatorService))
    }

    if (!Guards.isNullOrEmpty(opts.customValidationStrategy)) {
      for (const strategyToken of opts.customValidationStrategy) {
        if (Guards.isDefined(strategyToken)) validationStrategies.push(strategyToken(container))
      }
    }

    const { ValidationPipeline } = await import('@/application')
    return new ValidationPipeline(validationStrategies)
  },
} as const)
