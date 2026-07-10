import type { AuthPolicy, Dictionary, Optional } from '@/shared'

import type { IRequest, IServiceScope, IStrategy } from '../contracts'
import type { ApplicationRegistry } from './registries'

/**
 * @description PipelineConfig defines the configuration options for the CQRS pipelines in the application. It includes settings for performance monitoring, authorization, validation, command bus, and query bus. Each section allows for enabling or disabling specific features and providing additional configuration details as needed. This configuration is used by the CqrsModule to set up the appropriate middleware and services in the dependency injection container based on the specified options.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface PipelineConfig<
  TRegistry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
  TSchema = unknown,
> {
  /** @description Configuration for performance monitoring, including the ability to set a threshold in milliseconds for logging slow operations. If enabled, the PerformancePipeline will log a warning whenever the execution of a command or query exceeds the specified threshold, helping to identify potential performance bottlenecks in the application. If the threshold is not defined, all operations will be monitored without duration-based filtering.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  performance: {
    /** @description Optional threshold in milliseconds for logging slow operations. If defined, the PerformancePipeline will log a warning whenever the execution of a command or query exceeds this duration, allowing for performance monitoring and optimization. If not defined, all operations will be monitored without duration-based filtering.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    thresholdMs: Optional<number>
  }
  /** @description Configuration for authorization, allowing the enabling of authorization strategies based on tenant, policy, roles, and permissions. If enabled, the authorization pipeline will evaluate the specified strategies for each command or query, ensuring that only authorized users can perform certain actions. The configuration also includes the ability to define custom authorization strategies via injection tokens, providing flexibility in implementing application-specific access rules.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  authorization: {
    /** @description Flag to enable user-based authorization. If set to true, the authorization pipeline will include a strategy that checks if the user is authorized to perform the command or query based on their user ID. This is typically used in applications where actions are restricted to specific users, ensuring that only the intended user can execute certain operations.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    userId: boolean
    /** @description Flag to enable tenant-based authorization. If set to true, the authorization pipeline will include a strategy that checks if the user belongs to the appropriate tenant for the command or query being executed. This is typically used in multi-tenant applications to ensure that users can only access resources and perform actions within their own tenant context.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    tenantId: boolean
    /** @description Configuration for policy-based authorization, allowing the definition of a policy registry and the option to enable role-based or permission-based checks. If policy-based authorization is enabled, the authorization pipeline will include a strategy that evaluates the defined policies for each command or query, ensuring that users meet the necessary criteria based on their roles and permissions. The policy registry allows for central management of authorization policies, making it easier to maintain and update access rules across the application.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    policies: Optional<Dictionary<AuthPolicy>>
    /** @description An optional array of custom authorization strategies defined via injection tokens. If provided, these strategies will be included in the authorization pipeline and evaluated for each command or query, allowing for custom logic to determine if a user is authorized to perform a specific action. This provides flexibility in implementing application-specific access rules that may not fit into standard tenant-based or policy-based checks. Each strategy should implement the IStrategy interface and return a boolean indicating whether the command or query is authorized.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    customAuthorizationStrategy?: Optional<
      (container: IServiceScope<TRegistry>) => IStrategy<IRequest>
    >[]
  }
  /** @description Configuration for validation, allowing the enabling of validation based on Zod schemas or custom validation strategies. If enabled, the validation pipeline will validate commands and queries based on the specified criteria, ensuring that input data meets expectations before further processing. The configuration includes the ability to define Zod schemas for structural validation or to use custom strategies via injection tokens, providing flexibility in implementing application-specific validation rules.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  validation: {
    /** @description An optional configuration for Zod-based validation, allowing the definition of schemas for validating the structure and content of commands and queries. If provided, the validation pipeline will use these schemas to validate incoming requests, ensuring that they conform to the expected format and contain valid data before being processed further. This provides a powerful and flexible way to enforce data integrity and prevent invalid input from causing issues in the application.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    zod: Optional<SchemaConfig<TSchema>>
    /** @description An optional array of custom validation strategies defined via injection tokens. If provided, these strategies will be included in the validation pipeline and evaluated for each command or query, allowing for custom logic to determine if the input data is valid. This provides flexibility in implementing application-specific validation rules that may not fit into standard schema-based validation. Each strategy should implement the IStrategy interface and return a boolean indicating whether the command or query is valid.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    customValidationStrategy?: Optional<
      (container: IServiceScope<TRegistry>) => IStrategy<IRequest, boolean>
    >[]
  }
  /** @description Configuration for the command bus, allowing the enabling of features such as idempotency and concurrency management. If enabled, the command bus pipeline will include specific behaviors to handle these features, such as acquiring locks to ensure idempotency or managing retries in case of concurrency conflicts. The configuration includes specific details for each feature, such as TTLs for idempotency locks or delay strategies for concurrency retries, providing granular control over how commands are processed and managed within the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  commandBus: {
    idempotency: Optional<IdempotencyConfig>
    concurrency: Optional<ConcurrencyConfig>
  }
  /** @description Configuration for the query bus, allowing the enabling of features such as result caching. If enabled, the query bus pipeline will include specific behaviors to handle caching, such as storing query results in a cache system and retrieving results from the cache when available. The configuration includes specific details for caching, such as settings for Redis integration or the ability to use a custom cache via injection tokens, providing flexibility in how query results are stored and retrieved within the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  queryBus: {
    /** @description Flag to enable or disable query bus features. If set to true, the query bus pipeline will include additional behaviors based on the specified configuration, such as result caching. If set to false or not defined, the query bus will operate without these additional features, allowing queries to be processed in a standard manner without caching or other enhancements.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    isEnabled: boolean
  }
}

/** @description Configuration for caching, allowing the enabling of Redis integration or the use of a custom cache. If enabled, the query bus and command bus (in case of idempotency) pipelines will use the configured cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, as well as the ability to define a custom cache via injection tokens, providing flexibility in how the cache is implemented and used within the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface SchemaConfig<TSchema> {
  /** @description A record of Zod schemas, where each key represents a specific command or query type, and the corresponding value is the Zod schema used to validate that type. If provided, the validation pipeline will use these schemas to validate incoming requests, ensuring that they conform to the expected format and contain valid data before being processed further. This allows for powerful and flexible validation rules based on the structure and content of commands and queries.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  schemas: Dictionary<TSchema>
}

/** @description Configuration for idempotency, allowing the definition of TTLs for locks and processed results. If enabled, the command bus pipeline will include specific behaviors to handle idempotency, such as acquiring locks to ensure that a command with the same ID is processed only once and storing the results of processed commands for a defined period. The configuration includes specific details for TTLs, such as the duration of the lock and the duration for which processed results are retained, providing granular control over how idempotency is managed within the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
interface IdempotencyConfig {
  /** @description Optional TTL in seconds for the idempotency lock. This defines how long the lock should be held to prevent duplicate processing of commands with the same ID. If not defined, a default value will be used.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  lockTtlSeconds: Optional<number>
  /** @description Optional TTL in seconds for storing the results of processed commands. This defines how long the results of a processed command should be retained in the cache, allowing for retrieval if the same command is received again within that period. If not defined, a default value will be used.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  processedTtlSeconds: Optional<number>
}

/** @description Configuration for concurrency management, allowing the definition of maximum retries and delay strategies for retries. If enabled, the command bus pipeline will include specific behaviors to handle concurrency conflicts, such as retrying a command in case of failure due to a conflict. The configuration includes specific details for retries, such as the maximum number of attempts and delay strategies (e.g., exponential backoff with jitter) between attempts, providing granular control over how concurrency is managed within the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
interface ConcurrencyConfig {
  /** @description Optional maximum number of retry attempts in case of concurrency conflicts. This defines how many times the command bus should attempt to retry a command if it fails due to a concurrency issue, such as a version conflict in an optimistic concurrency control scenario. If not defined, a default value will be used.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  maxRetries?: Optional<number> /** @description Optional configuration for delay strategies between retry attempts. This can include settings for exponential backoff, jitter, or fixed delays to manage the timing of retries in case of concurrency conflicts. If not defined, a default delay strategy will be used.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  delayConfig: {
    /** @description Base delay in milliseconds for retries. This defines the initial delay before the first retry attempt in case of a concurrency conflict. If using an exponential backoff strategy, this base delay will be multiplied for each subsequent retry attempt. If not defined, a default value will be used.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    baseDelayMs: number
    /** @description Optional maximum delay in milliseconds for retries. This defines the upper limit for the delay between retry attempts, preventing excessively long delays in case of multiple retries. If not defined, a default value will be used.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    maxJitterMs: number
  }
}
