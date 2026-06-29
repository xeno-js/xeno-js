import type { ResultType } from '../../../results/result.types'

/**
 * @description Interface for a validation service that provides methods to check for the existence of validation schemas and to validate data against those schemas. The IValidatorService interface defines two methods: hasSchema, which checks if a validation schema exists for a given key, and validate, which validates data against a specified schema key and returns a ResultType indicating the success or failure of the validation process. This interface can be implemented by various validation services that utilize different schema validation libraries or custom validation logic to ensure that incoming data meets the required criteria before being processed further in the application.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface IValidatorService {
  /**
   * @description Validates the provided data against the validation schema associated with the specified key. This method performs the actual validation logic, checking if the data conforms to the rules defined in the corresponding schema. It returns a ResultType indicating whether the validation was successful or if it failed, along with any relevant error information if the validation did not pass.
   * @param key The key representing the type of data or request for which the validation is being performed. This key is used to identify the appropriate validation schema to apply to the data.
   * @param data The data to be validated against the schema. This can be any type of data that needs to be checked for conformity with the validation rules defined in the schema.
   * @returns A ResultType indicating the outcome of the validation. If the validation is successful, it returns a ResultType with a value of true; if the validation fails, it returns a ResultType with a value of false and includes error information.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  validate<T>(key: string, data: T): Promise<ResultType<boolean>>

  /**
   * @description Adds a new validation schema to the service's registry, associating it with the specified key. This method allows for dynamically registering validation schemas that can be used later for validating incoming data. The schema must conform to the expected structure defined by the validation library being used (e.g., Zod schemas). By adding schemas to the service, it enables the application to perform validation checks against those schemas when processing requests or data that require validation.
   * @param key The key representing the type of data or request for which the validation schema is being added. This key is used to identify the schema when performing validation checks.
   * @param schema The validation schema to be added, which defines the rules and structure that incoming data must conform to in order to pass validation. The specific type of the schema will depend on the validation library being used (e.g., ZodType for Zod schemas).
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addSchema<T>(key: string, schema: T): void
}
