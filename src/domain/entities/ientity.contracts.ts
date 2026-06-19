import type { UniqueId } from '../unique_id/unique-id'

/**
 * An interface representing a generic entity in the domain. An entity is an object that has a unique identity and is defined by its properties.
 *
 * @template T - The type of the properties of the entity.
 */
export interface IEntity<T> {
  /**
   * The unique identifier of the entity. This is a read-only property that should be assigned when the entity is created and should not change throughout the lifecycle of the entity.
   * @see UniqueId for more details on the unique identifier.
   */
  readonly id: UniqueId

  /** Retrieves the properties of the entity.
   *
   * @returns The properties of the entity.
   * @throws An error if the entity is in an invalid state or if the properties cannot be retrieved.
   */
  getProps(): T
}
