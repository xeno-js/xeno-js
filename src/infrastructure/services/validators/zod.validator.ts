import type { core, ZodType } from 'zod'

import type { IValidatorService, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import { Guards, PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

/**
 * @description Implementation of the IValidatorService interface using Zod schemas for validation. This service maintains a registry of Zod schemas identified by unique keys and provides methods to check for the existence of a schema and to validate data against a specified schema. The validate method returns a ResultType indicating success or failure, with detailed error information in case of validation failure, including formatted error messages from Zod.
 */
export class ZodValidatorService<T> implements IValidatorService<T> {
  /**
   * @description Constructs a new instance of the ZodValidatorService class, which takes a Map of string keys to ZodType instances as a parameter. This schema registry is used to store and manage the validation schemas that will be applied to incoming data. The constructor initializes the service with the provided schema registry, allowing it to perform validation checks based on the registered schemas when the validate method is called.
   * @param _schemaRegistry A Map where the keys are strings representing the type of data or request, and the values are ZodType instances that define the validation rules for that type. This registry is essential for the operation of the validator service, as it allows it to look up and apply the correct schema for validating incoming data.
   */
  constructor(private readonly _schemaRegistry: Map<string, ZodType<T>>) {}

  private static formatIssue(issue: core.$ZodIssue): string {
    const issuePath = !Guards.isNullOrEmpty(issue.path) ? issue.path.map(String).join('.') : 'root'

    return `[${issuePath}] ${issue.message}`
  }

  public hasSchema(key: string): boolean {
    return this._schemaRegistry.has(key)
  }

  public validate(key: string, data: T): ResultType<boolean> {
    const schema = this._schemaRegistry.get(key)

    if (!Guards.isDefined(schema)) {
      return Result.fail(
        AppError.create({
          code: PIPELINE_ERROR_CODES.UNEXPECTED_ERROR,
          message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.UNEXPECTED_ERROR],
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          name: key,
          cause: new Error(`Schema with key "${key}" does not exist in the registry.`),
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
          name: key,
          cause: new Error(`Validation failed for schema with key "${key}": ${errorMessage}`),
        }),
      )
    }

    return Result.ok(true)
  }
}
