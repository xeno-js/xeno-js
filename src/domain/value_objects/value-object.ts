import type { Optional } from '@/shared'
import { Guards, StringHelper } from '@/shared'

import type { IValueObject } from './ivalue-object.contracts'

/**
 * The ValueObject class is an abstract implementation of the IValueObject interface, providing a base class for creating value objects in the domain. A value object is an immutable type that represents a concept or measurement in the domain, and its equality is based on its properties rather than its identity. The ValueObject class includes a constructor that initializes the properties of the value object and an equals method that compares two value objects for equality based on their properties.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export abstract class ValueObject<T extends object> implements IValueObject<T> {
  /** @description The properties of the value object, which are immutable and define the value represented by the value object.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  protected readonly _props: T

  protected constructor(props: T) {
    this._props = Object.freeze({ ...props })
    Object.freeze(this)
  }

  public equals(vo: Optional<IValueObject<T>> = undefined): boolean {
    if (Guards.isNullOrEmpty(vo) || Guards.isNullOrEmpty(vo.getValue())) {
      return false
    }

    return StringHelper.safeStringify(this._props) === StringHelper.safeStringify(vo.getValue())
  }

  public getValue(): T {
    return { ...this._props }
  }

  public toString(): string {
    return StringHelper.safeStringify(this._props)
  }
}
