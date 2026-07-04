/**
 * The IValueObject interface defines the contract for value objects in the domain. A value object is an immutable type that represents a concept or measurement in the domain, and its equality is based on its properties rather than its identity. The IValueObject interface includes methods for retrieving the underlying value, comparing value objects for equality, and providing a string representation of the value object.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IValueObject<T extends object> {
  /**
   * Retrieves the underlying value of the value object. This method provides access to the encapsulated data, allowing it to be used in comparisons, transformations, or other operations while maintaining the integrity and immutability of the value object.
   * @returns The underlying value of the value object.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  getValue(): T

  /**
   * Compares the current value object with another value object for equality. This method checks if the underlying values of both value objects are equal, allowing for meaningful comparisons between value objects based on their encapsulated data rather than their reference identity.
   * @param other The other value object to compare with the current value object.
   * @returns True if the underlying values of both value objects are equal; otherwise, returns false.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  equals(other: IValueObject<T>): boolean

  /**
   * Returns a string representation of the value object. This method can be used for debugging, logging, or any scenario where a human-readable representation of the value object is needed. The string representation should ideally include relevant information about the underlying value to provide context when the value object is printed or logged.
   * @returns A string representation of the value object.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  toString(): string
}
