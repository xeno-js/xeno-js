import type { Dictionary } from '@xeno-js/shared'

import type { ApplicationRegistry } from '@/domain'

import type { DbContext } from '../db'

/**
 * @description The XenoRegistry type is an alias for the ApplicationRegistry specialized with DbContext. It represents the registry of application services and dependencies, specifically tailored for applications that utilize a database context. This type is used throughout the application to ensure consistent typing and to facilitate dependency injection and service resolution.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export type XenoRegistry<
  TSchema extends Dictionary = Dictionary,
  TExtensions = object,
> = ApplicationRegistry<DbContext<TSchema>> &
  Readonly<Omit<TExtensions, keyof ApplicationRegistry<DbContext<TSchema>>>>
