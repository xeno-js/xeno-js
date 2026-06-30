import type { IRequest, IValidatorService, ResultType } from '@/domain'
import { Result } from '@/domain'

import { BaseValidationStrategy } from './base-validation.strategy'

/**
 * @description Strategy that validates incoming requests against predefined schemas. It implements the IStrategy interface and uses a schema registry to determine if a schema exists for the given request type. If a schema is found, it validates the request against the schema using a safe parsing method. If the validation fails, it returns a failed Result with an appropriate AppError indicating a validation error. If the validation succeeds, it returns a successful Result with a boolean value of true.
 *
 * @author Gantry5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Gantry5
 */
export class SchemaValidationStrategy extends BaseValidationStrategy {
  /**
   * @description Constructs a new instance of the SchemaValidationStrategy class, which takes an IValidatorService as a parameter. This service is used to check for the existence of validation schemas and to perform the actual validation of requests against those schemas. The constructor initializes the strategy with the provided validator service, allowing it to execute the validation logic when handling requests in the CQRS pipeline.
   * @param _validator An instance of IValidatorService that provides methods to check for the existence of validation schemas and to validate data against those schemas. This service is essential for performing the schema validation logic in this strategy.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  constructor(private readonly _validator: IValidatorService) {
    super()
  }

  public async execute(request: IRequest): Promise<ResultType<boolean>> {
    const key = request.intent
    const parseResult = await this._validator.validate(key, request)

    if (!parseResult.isOk())
      return this.createValidationError(
        request,
        `Validation failed: ${parseResult.getErrorOrThrow().message}`,
      )

    return Result.ok(true)
  }
}
