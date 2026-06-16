# gear5 — Core Knowledge

## Code Style

- TypeScript strict, ES2023, ESNext modules, path alias `@/` → `src/`
- File naming: kebab-case (`app-error.ts`, `unique-id.ts`)
- Folder naming: kebab-case or snake_case (`value_objects/`, `unique_id/`)
- Classes/Interfaces: PascalCase; interfaces prefixed with `I`
- Constants objects: SCREAMING_SNAKE_CASE keys + `Object.freeze()`
- Utility namespaces: PascalCase + `Object.freeze()` (e.g. `Guards`,
  `GuidHelper`)
- Private constructors + static factory methods (`create`, `ok`, `fail`)
- `readonly` on all props; deep immutability with `Object.freeze()`
- JSDoc `/** */` on every public API
- Barrel `index.ts` per cartella con `export * from '...'`
- Generics: `TValue`, `TError`, `TRequest`, `TResponse`, `TInput`, `TOutput`

## Layers (Clean Architecture)

```
src/
  domain/       ← entities, value objects, contracts (interfaces), errors, results
  application/  ← use-cases, handlers, pipeline behaviors
  infrastructure/ ← repositories, DB, cache, logger implementations
  presentation/ ← controllers, HTTP, DTOs
  shared/       ← types, utils, constants (cross-cutting)
```

## shared/types — common.types.ts + injection-token.ts

| Type                     | Definition                                                |
| ------------------------ | --------------------------------------------------------- |
| `Optional<T>`            | `T \| undefined`                                          |
| `Nullable<T>`            | `T \| null`                                               |
| `Maybe<T>`               | `T \| null \| undefined`                                  |
| `Constructor<T, TArgs>`  | `new (...args) => T`                                      |
| `AbstractConstructor<T>` | `abstract new (...args) => T`                             |
| `Dictionary<V>`          | `Record<string, V>`                                       |
| `RequireKeys<T, K>`      | keys K required, rest unchanged                           |
| `Override<T, K, V>`      | key K overridden with V                                   |
| `KeysOfType<T, V>`       | keys of T whose values extend V                           |
| `Factory<T, TArgs>`      | `(...args: TArgs) => T`                                   |
| `AsyncFactory<T, TArgs>` | `(...args: TArgs) => Promise<T>`                          |
| `Resolver<T>`            | `(token: symbol) => T`                                    |
| `Guid`                   | `` `${string}-${string}-${string}-${string}-${string}` `` |
| `InjectionToken<T>`      | phantom-typed token (vedere sotto)                        |

## shared/constants

### ERROR_CODES (Object.freeze)

`SYSTEM_ERROR` · `NOT_IMPLEMENTED` · `EXTERNAL_SERVICE_ERROR` ·
`VALIDATION_FAILED` · `UNAUTHORIZED` · `FORBIDDEN` · `BAD_REQUEST` Type alias:
`ErrorCode`

### STATUS_CODES (Object.freeze)

2xx: `OK=200` · `CREATED=201` · `NO_CONTENT=204` 4xx: `BAD_REQUEST=400` ·
`UNAUTHORIZED=401` · `FORBIDDEN=403` · `NOT_FOUND=404` · `CONFLICT=409` ·
`UNPROCESSABLE_ENTITY=422` · `TOO_MANY_REQUESTS=429` ·
`CLIENT_CLOSED_REQUEST=499` 5xx: `INTERNAL_SERVER_ERROR=500` ·
`SERVICE_UNAVAILABLE=503` Type alias: `StatusCode`

### REQUEST_TYPE (Object.freeze)

`COMMAND` · `QUERY` Type alias: `RequestType`

## shared/utils

| Helper         | Key methods                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Guards`       | `isDefined`, `isNullOrEmpty`, `throwIfNullOrEmpty`, `hasMethod`, `isString`, `isNumber`, `isInteger`, `isFunction`, `isDate`, `isArray` |
| `GuidHelper`   | `generate(): Guid`, `isValid(value: string): boolean`                                                                                   |
| `StringHelper` | `safeStringify`, `camelCase`, `interpolate`, `truncate`                                                                                 |
| `DateHelper`   | `toISO`, `addDays`, `isExpired`, `isAfter`, `isFuture`                                                                                  |
| `TOKEN`        | `createToken<T>(description: string): InjectionToken<T>` — in `token.utils.ts` (**NON** esportato da `shared/utils/index.ts`)           |

### InjectionToken (shared/types/injection-token.ts)

```ts
// phantom key — non esiste a runtime
declare const _phantom: unique symbol
interface InjectionToken<T> {
  readonly symbol: symbol
  readonly [_phantom]: T
}
```

- `InjectionToken<A>` e `InjectionToken<B>` sempre distinti strutturalmente
- Creazione esclusivamente via `TOKEN.createToken<T>(description)`
- `container.resolve<IBlogService>(userRepositoryToken)` → compile error
- `container.resolve(userRepositoryToken)` → `IUserRepository` (T inferito)

## domain/errors

```ts
class AppError extends Error {
  readonly code: string
  readonly status: number
  static create(payload: { message; code; status; name; cause }): AppError
}
```

## domain/results

```ts
class Result<TValue, TError = never> {
  static ok<U>(value?: U): Result<U>
  static fail<U, V>(error: V): Result<U, V>
  isOk(): boolean
  getValueOrThrow(): Optional<TValue>
  getErrorOrThrow(): TError
}
type ResultType<T, E = AppError> = T extends Result<infer U, E> ? U : never
```

Usage: `Result.ok(value)` / `Result.fail(AppError.create({...}))`

## domain/entities

```ts
abstract class Entity<T> implements IEntity<T> {
  readonly id: UniqueId
  protected constructor(props: T, id?: Optional<UniqueId>)
  getProps(): T
}
interface IEntity<T> {
  readonly id: UniqueId
  getProps(): T
}
```

## domain/value_objects

```ts
abstract class ValueObject<T extends object> implements IValueObject<T> {
  protected readonly _props: T
  protected constructor(props: T) // Object.freeze
  equals(vo?: IValueObject<T>): boolean
  getValue(): T
  toString(): string
}
```

## domain/unique_id

```ts
class UniqueId {
  static create(): UniqueId
  toString(): string
  getValue(): Guid
  equals(other: UniqueId): boolean
}
```

## domain/contracts/cqrs

```ts
interface ICommand {
  readonly type: RequestType
  readonly timestamp: Date
  readonly TOKEN: symbol
}
interface ICommand extends ICommand {}
interface IQuery extends ICommand {}
interface IPaginatedQuery extends IQuery, IPaginationParams {}
interface ICachedQuery extends IQuery {
  cacheKey: string
  cacheTtlSeconds: Optional<number>
  bypassCache: Optional<boolean>
}
interface IHandler<TRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>
}
interface IMediator {
  send<TResponse>(request: ICommand): Promise<ResultType<TResponse>>
  query<TResponse>(request: IQuery): Promise<ResultType<TResponse>>
}
type Delegate<TResult> = () => Promise<ResultType<TResult>>
interface IPipelineBehavior<TInput, TResult> {
  handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>>
}
```

## domain/contracts/data

```ts
interface IRepository<T> {
  findById(id: string): Promise<Maybe<ResultType<T>>>
  findAll(): Promise<ResultType<T>[]>
  save(entity: T): Promise<ResultType<void>>
  delete(id: string): Promise<ResultType<void>>
}
interface IDbContext {
  beginTransaction(): Promise<void>
  commitTransaction(): Promise<void>
  rollbackTransaction(): Promise<void>
  runInTransaction<T>(op: () => Promise<ResultType<T>>): Promise<ResultType<T>>
}
interface ISqlExecutor<T> {
  find<TFilter>(filters: Dictionary<TFilter>): Promise<T[]>
  insert<TDto>(dto: TDto): Promise<void>
}
```

## domain/contracts/cache

```ts
interface ICache {
  get<T>(key: string): Optional<T>
  set<T>(key: string, value: T, ttl?: number): void
  remove(key: string): void
  has(key: string): boolean
  clear(): void
}
```

## domain/contracts/loggers

```ts
const LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 }
type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL]
interface ILogger {
  info
  warn
  error
  debug
  trackException
} // all: (msg, context?) or (msg, error?, context?)
interface ILoggerClient {
  track(
    level: LogLevel,
    msg: string,
    context: Optional<Dictionary>,
    error: Optional<Error>,
  ): void
}
```

## domain/contracts/pagination

```ts
interface IPaginationParams { page, pageSize, sortBy, sortDirection, filters }
interface IPaginatedResult<T> { data: ReadonlyArray<T>; total; page; pageSize; totalPages; hasNextPage; hasPreviousPage }
const PaginationDefaults = { PAGE:1, PAGE_SIZE:20, MAX_PAGE_SIZE:100 }
const SORT_DIRECTION = { ASC, DESC }
type SortDirection = ...
```

## domain/contracts/identity

```ts
interface Identity {
  id: Optional<string>
  roles: Optional<ReadonlyArray<string>>
  correlationId: Optional<string>
}
interface IRequestContext {
  runAsync<T>(fn: (identity: Identity) => Promise<T>): Promise<T>
  getContext(): Identity
}
```

## domain/contracts/mappers

```ts
interface IMapper<TE, TDto> {
  toDto(entity: TE): TDto
  toEntity(dto: TDto): TE
}
```

## domain/contracts/factories

```ts
interface IFactory<TInput, TOutput> {
  create: Factory<TOutput, [TInput]>
}
```

## domain/contracts/container

```ts
type Lifetime = 'singleton' | 'transient' | 'scoped'

// InjectionToken e TOKEN.createToken vivono in @/shared (non qui)
interface ServiceDescriptor<T> {
  implementation: Constructor<T> // importa Constructor da @/shared
  dependencies: ReadonlyArray<InjectionToken<unknown>> // importa InjectionToken da @/shared
  lifetime: Lifetime
}

interface IServiceScope {
  resolve<T>(token: InjectionToken<T>): T
  dispose(): void
}
interface IServiceContainer {
  addSingleton<T>(
    token: InjectionToken<T>,
    impl: Constructor<T>,
    deps?: Optional<ReadonlyArray<InjectionToken<unknown>>>,
  ): this
  addTransient<T>(
    token: InjectionToken<T>,
    impl: Constructor<T>,
    deps?: Optional<ReadonlyArray<InjectionToken<unknown>>>,
  ): this
  addScoped<T>(
    token: InjectionToken<T>,
    impl: Constructor<T>,
    deps?: Optional<ReadonlyArray<InjectionToken<unknown>>>,
  ): this
  resolve<T>(token: InjectionToken<T>): T
  createScope(): IServiceScope
}
```

## infrastructure/container

- `Map<symbol, ServiceDescriptor<unknown>>` — chiave = `token.symbol`
- Unico `as unknown as InjectionToken<T>` in `TOKEN.createToken` (boundary della
  factory)
- Unico `as T` in `resolve<T>` di ogni classe (boundary pubblico)
- `InjectionToken`, `Constructor`, `Optional` importati da `@/shared`
- `ServiceDescriptor`, `IServiceContainer`, `IServiceScope` importati da
  `@/domain`
- Esportati da `src/infrastructure/index.ts`: `ServiceContainer`, `ServiceScope`

## application/cqrs

- Cartella presente ma **vuota** — da implementare
