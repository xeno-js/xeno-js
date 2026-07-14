// ─── Nullability ─────────────────────────────────────────────────────────────

/**
 * @description Represents a value that may be `null`.
 * Prefer this over `T | null` in all public APIs so intent is self-documenting.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Nullable<T> = T | null

/**
 * @description Represents a value that may be `undefined`.
 * Prefer this over `T | undefined` in all public APIs.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Optional<T> = T | undefined

/**
 * @description Represents a value that may be either `null` or `undefined`.
 * Use when a value is absent regardless of the reason.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Maybe<T> = T | null | undefined

// ─── Constructor Types ────────────────────────────────────────────────────────
/**
 * @description Represents a concrete (instantiable) class.
 * Used by IoC containers and auto-wiring utilities to bind concrete implementations.
 *
 * @template T  The instance type produced by `new`.
 * @template TArgs  Constructor parameter tuple; defaults to `any[]`.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Constructor<T, TArgs extends Dictionary[] = Dictionary[]> = new (...args: TArgs) => T

/**
 * @description Represents an abstract class that cannot be instantiated directly.
 * Used for binding abstract base classes in the IoC container without requiring
 * a concrete constructor signature.
 *
 * @template T  The instance type produced by subclasses.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type AbstractConstructor<T> = abstract new (...args: Dictionary[]) => T

// ─── Object / Record Helpers ──────────────────────────────────────────────────

/**
 * @description A plain-object dictionary with string keys and uniform value type.
 * Prefer over `{ [key: string]: V }` for self-documenting intent.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Dictionary<V = unknown> = Record<string, V>

/**
 * @description Produces a new type with only the keys `K` made required;
 * all other keys retain their original optionality.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * @description Produces a new type where property `K` is overridden with type `V`.
 * Useful for narrowing a property inside a generic base type.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Override<T, K extends keyof T, V> = Omit<T, K> & Record<K, V>

/**
 * @description Extracts only the keys of `T` whose values are assignable to `V`.
 *
 * @example
 * type StringKeys = KeysOfType<{ a: string; b: number; c: string }, string>;
 * // => 'a' | 'c'

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

// ─── Factory Types ───────────────────────────────────────────────────────────

/**
 * @description Generic factory function that produces a value of type `T`.
 *
 * `TArgs` defaults to an empty tuple for zero-argument factories, enabling
 * usage both as a plain provider (`Factory<T>`) and as a parameterised
 * creator (`Factory<T, [config: MyConfig]>`).
 *
 * @template T     The type of the value produced.
 * @template TArgs Tuple of constructor/factory argument types.
 *
 * @example
 * // Zero-argument factory
 * const makeLogger: Factory<ILoggerService> = () => new ConsoleLogger();
 *
 * // Parameterised factory
 * const makeRepo: Factory<IRepository<Entity>, [tx: Transaction]> =
 *   (tx) => new DrizzleRepository(tx);

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Factory<T, TArgs extends unknown[] = []> = (...args: TArgs) => T

/**
 * @description Async variant of `Factory<T, TArgs>`.
 * Use when the construction process involves I/O (e.g. DB pool acquisition).
 *
 * @template T     The type of the resolved value.
 * @template TArgs Tuple of factory argument types.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type AsyncFactory<T, TArgs extends unknown[] = []> = (...args: TArgs) => Promise<T>

// ─── IoC Resolver ─────────────────────────────────────────────────────────────

/**
 * @description Delegate used by application-layer services to perform lazy,
 * symbol-keyed dependency resolution without coupling to the concrete container.
 *
 * This is the **only** sanctioned way to resolve dependencies at runtime outside
 * of constructor injection. Never inject the raw IoC container into services.
 *
 * @template T  Narrows the return type at each call site.
 *
 * @example
 * class NexusMediator {
 *   constructor(private readonly resolve: Resolver) {}
 *
 *   send<TResult>(command: ICommand): Promise<TResult> {
 *     const handler = this.resolve<ICommandHandler<typeof command, TResult>>(
 *       command.resolverToken,
 *     );
 *     return handler.execute(command);
 *   }
 * }

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Resolver<T = unknown> = (token: symbol) => T

/**
 * @description Async variant of `Resolver` for containers that resolve
 * dependencies asynchronously (e.g. lazy module loading, remote config).
 *
 * @template T  Narrows the resolved type at each call site.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type AsyncResolver = <T>(token: symbol) => Promise<T>

// ─── Miscellaneous Types ─────────────────────────────────────────────────────

/**
 * @description Represents a globally unique identifier (GUID/UUID) as a string.
 * The format is typically 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Guid = `${string}-${string}-${string}-${string}-${string}`

/**
 * @description Represents a function that performs setup or configuration
 * based on the provided options of type `T`.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type SetupAction<T, E = undefined> = (options: T, config: E) => void

/**
 * @description Represents a valid HTTP path.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export type Path =
  | `/${string}`
  | `/${string}/${string}`
  | `/${string}/${string}/${string}`
  | `/${string}/${string}/${string}/${string}`
  | `/${string}/${string}/${string}/${string}/${string}`
