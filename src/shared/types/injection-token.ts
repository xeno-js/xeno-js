// ─── Phantom type key ─────────────────────────────────────────────────────────
// `declare const` means this symbol does NOT exist at runtime.
// It lives only in the type system and acts as a nominal brand for InjectionToken<T>.
declare const _phantom: unique symbol

/**
 * @description A typed injection token that binds a runtime `symbol` to a
 * compile-time type `T` via a phantom property.
 *
 * Using a `unique symbol` phantom key guarantees that `InjectionToken<A>`
 * and `InjectionToken<B>` are always structurally distinct, regardless of
 * how similar `A` and `B` are. This prevents accidental cross-token resolution
 * such as `container.resolve<IBlogService>(userRepositoryToken)`.
 *
 * Tokens must be created exclusively through {@link createToken}.
 */
export interface InjectionToken<T> {
  /** @description The unique symbol that identifies this token at runtime. */
  readonly symbol: symbol
  /** @description Phantom property to bind the generic type `T` to this token. */
  readonly [_phantom]: T
}
