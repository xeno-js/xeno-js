import type { Guid } from '@/shared'
import { GuidHelper } from '@/shared'

/**
 * A class representing a unique identifier (UUID v4) for entities in the domain.
 * This class encapsulates the generation and representation of unique identifiers.
 */
export class UniqueId {
  /**
   * Private constructor to prevent direct instantiation. Use the static method `create` to generate a new unique identifier.
   * @param _value The string representation of the unique identifier (UUID v4).
   * @returns A new instance of UniqueId with a generated UUID v4.
   */
  private constructor(private readonly _value: Guid) {}

  /**
   * Static factory method to create a new UniqueId instance with a generated UUID v4.
   * @returns A new instance of UniqueId with a generated UUID v4.
   */
  public static create(): UniqueId {
    const uniqueId = GuidHelper.generate()
    return new UniqueId(uniqueId)
  }

  /**
   * Returns the string representation of the unique identifier.
   * @returns The string representation of the unique identifier (UUID v4).
   */
  public toString(): string {
    return this._value.toString()
  }

  /**
   * Returns the underlying GUID value of the UniqueId instance.
   * @returns The GUID value of the UniqueId instance.
   */
  public getValue(): Guid {
    return this._value
  }

  /**
   * Compares this UniqueId with another for equality based on their string values.
   * @param other The other UniqueId to compare with.
   * @returns True if both UniqueIds have the same string value, false otherwise.
   */
  public equals(other: UniqueId): boolean {
    return this._value === other.getValue()
  }
}
