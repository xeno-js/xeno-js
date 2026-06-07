import type { ICache } from '@/domain'
import { Guards, type Optional, StringHelper } from '@/shared'

/**
 * @description The InMemoryCache class provides an implementation of the ICache interface using an in-memory Map to store cached values. This class allows for storing, retrieving, and managing cached values in memory, supporting features such as time-to-live (TTL) for cache entries and atomic operations for setting values only if they do not already exist. The InMemoryCache class is a simple and efficient caching solution for scenarios where a lightweight, in-memory cache is sufficient, such as during development or for caching non-critical data that does not require persistence across application restarts.
 */
export class InMemoryCache implements ICache {
  /**
   * @description Constructs a new instance of the InMemoryCache class, which initializes an internal Map to store cached values. The Map is used to associate cache keys with their corresponding values and expiration times, allowing for efficient retrieval and management of cached data. The constructor does not take any parameters, as the in-memory cache is self-contained and does not require external dependencies or configuration.
   * @param _cache An optional Map instance to use as the underlying storage for the cache. If not provided, a new Map will be created to store cached values.
   */
  constructor(
    private _cache: Map<string, { value: string; expiresAt: Optional<number> }> = new Map(),
  ) {}

  public async get<T>(key: string): Promise<Optional<T>> {
    const entry = this._cache.get(key)
    if (!Guards.isDefined(entry)) {
      return undefined
    }
    if (Guards.isDefined(entry.expiresAt) && entry.expiresAt < Date.now()) {
      this._cache.delete(key)
      return undefined
    }
    return JSON.parse(entry.value) as T
  }

  public async set<T>(key: string, value: T, ttl: Optional<number>): Promise<void> {
    const expiresAt = Guards.isDefined(ttl) ? Date.now() + ttl * 1000 : undefined
    this._cache.set(key, { value: StringHelper.safeStringify(value), expiresAt })
  }

  public async setIfAbsent<T>(key: string, value: T, ttl: Optional<number>): Promise<boolean> {
    if (this._cache.has(key)) {
      return false
    }
    await this.set(key, value, ttl)
    return true
  }

  public async remove(key: string): Promise<void> {
    this._cache.delete(key)
  }

  public async has(key: string): Promise<boolean> {
    const entry = this._cache.get(key)
    if (!Guards.isDefined(entry)) {
      return false
    }
    if (Guards.isDefined(entry.expiresAt) && entry.expiresAt < Date.now()) {
      this._cache.delete(key)
      return false
    }
    return true
  }

  public async clear(): Promise<void> {
    this._cache.clear()
  }
}
