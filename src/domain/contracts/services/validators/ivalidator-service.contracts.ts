import type { ResultType } from '@/domain'

/**
 * @description Interface for a validation service that provides methods to check for the existence of validation schemas and to validate data against those schemas. The IValidatorService interface defines two methods: hasSchema, which checks if a validation schema exists for a given key, and validate, which validates data against a specified schema key and returns a ResultType indicating the success or failure of the validation process. This interface can be implemented by various validation services that utilize different schema validation libraries or custom validation logic to ensure that incoming data meets the required criteria before being processed further in the application.
 */
export interface IValidatorService<T = unknown> {
  /**
   * @description Checks if a validation schema exists for the given key. This method is used to determine if there is a predefined schema available for validating data associated with the specified key, which typically corresponds to a request type or command in the application. It returns a boolean value indicating whether the schema exists or not.
   * @param key The key representing the type of data or request for which the validation schema is being checked. This key is often derived from the request token or command type and is used to look up the corresponding validation schema in the registry.
   * @returns A boolean value indicating whether a validation schema exists for the specified key. If true, it means that there is a schema available for validating data of that type; if false, it indicates that no schema is defined for that key.
   */
  hasSchema(key: string): boolean
  /**
   * @description Validates the provided data against the validation schema associated with the specified key. This method performs the actual validation logic, checking if the data conforms to the rules defined in the corresponding schema. It returns a ResultType indicating whether the validation was successful or if it failed, along with any relevant error information if the validation did not pass.
   * @param key The key representing the type of data or request for which the validation is being performed. This key is used to identify the appropriate validation schema to apply to the data.
   * @param data The data to be validated against the schema. This can be any type of data that needs to be checked for conformity with the validation rules defined in the schema.
   * @returns A ResultType indicating the outcome of the validation. If the validation is successful, it returns a ResultType with a value of true; if the validation fails, it returns a ResultType with a value of false and includes error information.
   */
  validate(key: string, data: T): ResultType<boolean>
}
