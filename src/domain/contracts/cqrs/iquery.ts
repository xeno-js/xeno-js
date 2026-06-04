import type { IPaginationParams } from '@/domain'
import type { Optional } from '@/shared'

import type { IBaseRequest } from './index'

/**
 * @fileoverview Defines the IQuery interface for query requests in a CQRS architecture.
 */

/**
 * @description An interface representing a paginated query request, which extends the base IQuery interface and includes pagination parameters.
 */
export interface IPaginatedQuery<T = unknown> extends IBaseRequest<T>, IPaginationParams {}

/**
 * @description Marker interface per le Query che supportano il caching.
 * Il CachingBehavior intercetterà automaticamente i comandi che implementano questo contratto.
 */
export interface ICachedQuery<T = unknown> extends IBaseRequest<T> {
  /** * @description La chiave univoca sotto cui salvare il risultato.
   * Deve includere i parametri (es. `travel-intents:tenant-123:page-1`).
   */
  readonly cacheKey: string

  /** @description (Opzionale) Tempo di vita in secondi. Se omesso, usa il default del servizio. */
  readonly cacheTtlSeconds: Optional<number>

  /** * @description (Opzionale) Se true, forza la lettura dal DB ignorando la cache (Hard Refresh).
   * Sovrascriverà comunque la cache con il nuovo risultato.
   */
  readonly bypassCache: Optional<boolean>
}
