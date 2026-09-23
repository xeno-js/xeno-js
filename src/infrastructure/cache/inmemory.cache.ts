import { Guards, InMemoryCache, type Optional } from '@xeno-js/shared'

import type { IAtomicCache } from '@/domain'

/**
 * @description The InMemoryCacheExtended class extends the InMemoryCache class and implements the IAtomicCache interface. It provides an implementation of the increment method, which increments the value associated with the given key in the cache. If the key does not exist, it is created with an initial value of 1. The method returns a Promise that resolves to the incremented value.
 */
export class InMemoryCacheExtended extends InMemoryCache implements IAtomicCache {
  public async increment(key: string, ttlSeconds: Optional<string | number>): Promise<number> {
    const current = (await this.get<number>(key)) ?? 0
    const next = Number(current) + 1
    const ttl = Guards.isDefined(ttlSeconds) ? Number(ttlSeconds) : 60
    await this.set(key, next, ttl)
    return next
  }
}
