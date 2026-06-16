import type { ICache, IPolicyRegistry } from '@/domain'
import type { AuthPolicy, Optional } from '@/shared'

/**
 * @description The PolicyRegistry class is an implementation of the IPolicyRegistry interface that manages role-based access control policies. It provides methods to add policies for certain intents and to retrieve the access control policy for a given intent. The policies are stored in a cache, allowing for efficient retrieval and management of access control policies across the application.
 */
export class PolicyRegistry implements IPolicyRegistry {
  /**
   * @description Constructs a new instance of the PolicyRegistry class, which is responsible for managing role-based access control policies. It takes an ICache instance as a parameter, which is used to store and retrieve policies for specific intents. The cache allows for efficient management of access control policies across the application.
   * @param _cache An instance of ICache used to store and retrieve policies for specific intents. This cache is essential for efficient management of access control policies across the application.
   */
  constructor(private readonly _cache: ICache) {}

  public async addPolicy(intent: string, policy: AuthPolicy): Promise<this> {
    const key = this.getKey(intent)
    await this._cache.set(key, policy, undefined)
    return this
  }

  public async getPolicy(intent: string): Promise<Optional<AuthPolicy>> {
    const key = this.getKey(intent)
    return await this._cache.get(key)
  }

  private getKey(intent: string): string {
    return `policy:${intent.toLowerCase()}`
  }
}
