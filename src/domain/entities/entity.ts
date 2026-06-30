import type { Optional } from '@/shared'
import { Guards, GuidHelper } from '@/shared'

import { UniqueId } from '../unique_id/unique-id'
import type { IEntity } from './ientity.contracts'
/**
 * A base class representing a generic entity in the domain. An entity is an object that has a unique identity and is defined by its properties.
 *
 * @template T - The type of the properties of the entity.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export abstract class Entity<T> implements IEntity<T> {
  public readonly id: UniqueId

  /**
   * The properties of the entity. This is a private property that holds the state of the entity. It should be accessed and modified through methods defined in the concrete entity classes to ensure encapsulation and maintain invariants.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  private readonly props: T

  /**
   * Protected constructor to prevent direct instantiation. Concrete entity classes should extend this base class and call this constructor with the appropriate properties and an optional unique identifier.
   *
   * @param props - The properties of the entity.
   * @param id - An optional unique identifier for the entity. If not provided, a new UniqueId will be generated.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  protected constructor(props: T, id: Optional<UniqueId> = undefined) {
    if (Guards.isNullOrEmpty(id)) {
      this.id = UniqueId.create()
    } else if (GuidHelper.isValid(id.getValue())) {
      this.id = id
    } else {
      throw new Error('Invalid UniqueId provided.')
    }
    this.props = Object.freeze({ ...props })
    Object.freeze(this)
  }

  public getProps(): T {
    return structuredClone(this.props)
  }
}
