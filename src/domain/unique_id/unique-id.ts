import type { Guid } from '@/shared'
import { Guards, GuidHelper } from '@/shared'

/**
 * A class representing a unique identifier (UUID v4) for entities in the domain.
 * This class encapsulates the generation and representation of unique identifiers.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class UniqueId {
  /**
   * Private constructor to prevent direct instantiation. Use the static method `create` to generate a new unique identifier.
   * @param _value The string representation of the unique identifier (UUID v4).
   * @returns A new instance of UniqueId with a generated UUID v4.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private constructor(private readonly _value: Guid) {
    Object.freeze(this)
  }

  /**
   * Static factory method to create a new UniqueId instance with a generated UUID v4.
   * @returns A new instance of UniqueId with a generated UUID v4.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public static create(id?: string): UniqueId {
    const uniqueId =
      !Guards.isNullOrEmpty(id) && GuidHelper.isValid(id) ? id : GuidHelper.generate()
    return new UniqueId(uniqueId)
  }

  /**
   * Returns the string representation of the unique identifier.
   * @returns The string representation of the unique identifier (UUID v4).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public toString(): string {
    return this._value.toString()
  }

  /**
   * Returns the underlying GUID value of the UniqueId instance.
   * @returns The GUID value of the UniqueId instance.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public getValue(): Guid {
    return this._value
  }

  /**
   * Compares this UniqueId with another for equality based on their string values.
   * @param other The other UniqueId to compare with.
   * @returns True if both UniqueIds have the same string value, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public equals(other: UniqueId): boolean {
    if (!(other instanceof UniqueId)) {
      return false
    }
    return this._value === other.getValue()
  }
}
