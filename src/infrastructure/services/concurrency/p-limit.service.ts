import type { IConcurrencyService } from '@/domain'

/**
 * @description Concrete implementation of IConcurrencyService utilizing the 'p-limit' library.
 * This service ensures that no matter how many tasks are submitted, only the specified 'concurrencyLimit' number of tasks will be in a pending state simultaneously.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class PLimitConcurrencyService implements IConcurrencyService {
  public async executeInParallel<T>(
    tasks: (() => Promise<T>)[],
    concurrencyLimit: number,
  ): Promise<T[]> {
    const { default: pLimit } = await import('p-limit')

    const limit = pLimit(concurrencyLimit)

    const promises = tasks.map((task) => limit(task))

    return Promise.all(promises)
  }
}
