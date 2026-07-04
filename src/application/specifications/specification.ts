import type { ISpecification } from '@/domain'

/**
 * Base class for specifications, providing default implementations for logical operations (AND, OR, NOT).
 *
 * @template T - The type of the candidate object that the specification will evaluate.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
export abstract class Specification<T> implements ISpecification<T> {
  /**
   * Determines if the candidate satisfies the specification criteria.
   *
   * @param candidate - The object to evaluate against the specification.
   * @returns A boolean indicating whether the candidate satisfies the specification.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public abstract isSatisfiedBy(candidate: T): boolean

  /**
   * Combines this specification with another specification using a logical AND operation.
   *
   * @param other - Another specification to combine with this specification.
   * @returns A new specification that represents the logical AND of this and the other specification.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification<T>(this, other)
  }

  /**
   * Combines this specification with another specification using a logical OR operation.
   *
   * @param other - Another specification to combine with this specification.
   * @returns A new specification that represents the logical OR of this and the other specification.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification<T>(this, other)
  }

  /**
   * Inverts this specification using a logical NOT operation.
   *
   * @returns A new specification that represents the logical NOT of this specification.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public not(): ISpecification<T> {
    return new NotSpecification<T>(this)
  }
}

/**
 * A specification that represents the logical AND of two specifications. It evaluates to true if both specifications are satisfied by the candidate.
 *
 * @template T - The type of the candidate object that the specification will evaluate.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
class AndSpecification<T> extends Specification<T> {
  constructor(
    private _left: ISpecification<T>,
    private _right: ISpecification<T>,
  ) {
    super()
  }
  public isSatisfiedBy(candidate: T): boolean {
    return this._left.isSatisfiedBy(candidate) && this._right.isSatisfiedBy(candidate)
  }
}

/**
 * A specification that represents the logical OR of two specifications. It evaluates to true if at least one of the specifications is satisfied by the candidate.
 *
 * @template T - The type of the candidate object that the specification will evaluate.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
class OrSpecification<T> extends Specification<T> {
  constructor(
    private _left: ISpecification<T>,
    private _right: ISpecification<T>,
  ) {
    super()
  }
  public isSatisfiedBy(candidate: T): boolean {
    return this._left.isSatisfiedBy(candidate) || this._right.isSatisfiedBy(candidate)
  }
}

/**
 * A specification that represents the logical NOT of another specification. It evaluates to true if the original specification is not satisfied by the candidate.
 *
 * @template T - The type of the candidate object that the specification will evaluate.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
class NotSpecification<T> extends Specification<T> {
  constructor(private _spec: ISpecification<T>) {
    super()
  }
  public isSatisfiedBy(candidate: T): boolean {
    return !this._spec.isSatisfiedBy(candidate)
  }
}
