import type { core, ZodType } from 'zod'

import type { IValidatorService, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import { Guards, PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

/**
 * @description Implementation of the IValidatorService interface using Zod schemas for validation. This service maintains a registry of Zod schemas identified by unique keys and provides methods to check for the existence of a schema and to validate data against a specified schema. The validate method returns a ResultType indicating success or failure, with detailed error information in case of validation failure, including formatted error messages from Zod.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class ZodValidatorService implements IValidatorService {
  /**
   * @description Constructs a new instance of the ZodValidatorService class, which takes an ICache instance as a parameter. This cache is used to store and manage the validation schemas that will be applied to incoming data. The constructor initializes the service with the provided cache, allowing it to perform validation checks based on the cached schemas when the validate method is called.
   * @param _cache An instance of ICache used to store and retrieve Zod schemas. This cache is essential for the operation of the validator service, as it allows it to look up and apply the correct schema for validating incoming data.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  constructor(private readonly _cache: Map<string, ZodType> = new Map()) {}

  private static formatIssue(issue: core.$ZodIssue): string {
    const issuePath = !Guards.isNullOrEmpty(issue.path) ? issue.path.map(String).join('.') : 'root'

    return `[${issuePath}] ${issue.message}`
  }

  public addSchema<T>(key: string, schema: T extends ZodType ? T : never): void {
    this._cache.set(key, schema)
  }

  public async validate<T>(key: string, data: T): Promise<ResultType<boolean>> {
    const schema = this._cache.get(key)
    if (!Guards.isDefined(schema)) {
      return Result.fail(
        AppError.create({
          code: PIPELINE_ERROR_CODES.VALIDATION_ERROR,
          message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.VALIDATION_ERROR],
          status: STATUS_CODES.BAD_REQUEST,
          name: 'ZodValidatorService',
          cause: new Error(`Validation schema not found for key: ${key}`),
        }),
      )
    }

    const zodResult = schema.safeParse(data)

    if (!zodResult.success) {
      const errorMessage = zodResult.error.issues
        .map((issue) => ZodValidatorService.formatIssue(issue))
        .join(', ')

      return Result.fail(
        AppError.create({
          code: PIPELINE_ERROR_CODES.VALIDATION_ERROR,
          message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.VALIDATION_ERROR],
          status: STATUS_CODES.BAD_REQUEST,
          name: 'ZodValidatorService',
          cause: new Error(`Validation failed for schema: ${errorMessage}`),
        }),
      )
    }

    return Result.ok(true)
  }
}
