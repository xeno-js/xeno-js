/**
 * @file disposable.contracts.ts
 * @description This file defines the interface for disposable resources in the application. The IDisposable interface specifies a method for disposing of resources, which is expected to be implemented by any class that adheres to this contract. This allows for consistent management of resource cleanup across different implementations.
 */

/**
 * @description IDisposable defines the contract for disposable resources. It provides a method to dispose of resources, allowing for proper cleanup when they are no longer needed. This interface ensures that any class implementing it will provide a consistent way to manage the lifecycle of disposable resources.
 * @example
 * ```ts
 * class MyResource implements IDisposable {
 *     async dispose(): Promise<void> {
 *         // Cleanup logic here
 *     }
 * }
 * ```
 */
export interface IDisposable {
  /**
   * @description Disposes of the resource, releasing any held resources and performing necessary cleanup. This method should be called when the resource is no longer needed to ensure proper cleanup and avoid resource leaks.
   * @returns A promise that resolves when the disposal process is complete.
   */
  dispose(): Promise<void>
}
