import type { Dictionary, Maybe } from '@/shared'

const OBJECT_TAG = '[object Object]'
const DATE_TAG = '[object Date]'

/**
 * @description Centralized type guards and runtime predicates.
 */
export const Guards = Object.freeze({
  /**
   * @description Checks value is neither null nor undefined.
   * @param value Candidate value.
   * @returns True when value is defined.
   */
  isDefined<TValue>(value: Maybe<TValue>): value is TValue {
    return value !== null && value !== undefined && value !== '' && value !== false
  },

  /**
   * @description Checks value is null, undefined, empty string, or false.
   * @param value Candidate value.
   * @returns True when value is null, undefined, empty string, or false.
   */
  isNullOrEmpty<TValue>(value: Maybe<TValue>): value is null | undefined {
    return (
      !Guards.isDefined(value) ||
      (Guards.isString(value) && value.trim() === '') ||
      (Guards.isArray(value) && value.length === 0)
    )
  },

  /**
   * @description Throws an error if the value is null, undefined, empty string, or false.
   * @param value Candidate value.
   * @param errorMessage Error message to throw if the check fails.
   * @throws Error with the provided message if the value is null, undefined, empty string, or false.
   */
  throwIfNullOrEmpty<TValue>(value: Maybe<TValue>, errorMessage: string): void {
    if (Guards.isNullOrEmpty(value)) {
      throw new Error(errorMessage)
    }
  },

  /**
   * @description Throws an error if the value is not a positive integer.
   * @param value Candidate value.
   * @param errorMessage Error message to throw if the check fails.
   * @throws Error with the provided message if the value is not a positive integer.
   */
  throwIfNegative(value: number, errorMessage: string): void {
    if (Guards.isInteger(value) && value < 0) {
      throw new Error(errorMessage)
    }
  },

  /**
   * @description Throws an error if the value is not an integer.
   * @param value Candidate value.
   * @param errorMessage Error message to throw if the check fails.
   * @throws Error with the provided message if the value is not an integer.
   */
  throwIfNotInteger(value: number, errorMessage: string): void {
    if (!Guards.isInteger(value)) {
      throw new Error(errorMessage)
    }
  },

  /**
   * @description Checks if an object has a method with the given name.
   * @param obj Object to check.
   * @param methodName Name of the method to look for.
   * @returns True when obj has a function property named methodName.
   */
  hasMethod(obj: unknown, methodName: string): boolean {
    if (!this.isDefined(obj)) return false

    // Essendo all'interno del namespace di utilità, l'uso di typeof qui è consentito
    return Guards.isFunction((obj as Dictionary<unknown>)[methodName])
  },

  /**
   * @description Checks value is a string.
   * @param value Candidate value.
   * @returns True when value is string.
   */
  isString(value: unknown): value is string {
    return typeof value === 'string'
  },

  /**
   * @description Checks value is a finite number.
   * @param value Candidate value.
   * @returns True when value is finite number.
   */
  isNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value)
  },

  /**
   * @description Checks value is an integer number.
   * @param value Candidate value.
   * @returns True when value is integer number.
   */
  isInteger(value: unknown): value is number {
    return Guards.isNumber(value) && Number.isInteger(value)
  },

  /**
   * @description Checks value is boolean.
   * @param value Candidate value.
   * @returns True when value is boolean.
   */
  isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  },

  /**
   * @description Checks value is bigint.
   * @param value Candidate value.
   * @returns True when value is bigint.
   */
  isBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  },

  /**
   * @description Checks value is symbol.
   * @param value Candidate value.
   * @returns True when value is symbol.
   */
  isSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol'
  },

  /**
   * @description Checks value is a function.
   * @param value Candidate value.
   * @returns True when value is function.
   */
  isFunction(value: unknown): value is (...args: readonly unknown[]) => unknown {
    return typeof value === 'function'
  },

  /**
   * @description Checks value is an array.
   * @param value Candidate value.
   * @returns True when value is array.
   */
  isArray<TValue>(value: unknown): value is TValue[] {
    return Array.isArray(value)
  },

  /**
   * @description Checks value is a Date instance with valid timestamp.
   * @param value Candidate value.
   * @returns True when value is valid Date.
   */
  isDate(value: unknown): value is Date {
    if (Object.prototype.toString.call(value) !== DATE_TAG) {
      return false
    }

    return Number.isFinite((value as Date).getTime())
  },

  /**
   * @description Checks value is an Error instance.
   * @param value Candidate value.
   * @returns True when value is Error.
   */
  isError(value: unknown): value is Error {
    return value instanceof Error
  },

  /**
   * @description Checks value is a plain object record.
   * @param value Candidate value.
   * @returns True when value is object record.
   */
  isObjectRecord(value: unknown): value is Readonly<Dictionary<unknown>> {
    if (!Guards.isDefined(value)) {
      return false
    }

    return Object.prototype.toString.call(value) === OBJECT_TAG
  },

  /**
   * @description Checks value is an object (not null).
   * @param value Candidate value.
   * @returns True when value is object.
   */
  isObject(value: unknown): value is object {
    return typeof value === 'object' && Guards.isDefined(value)
  },

  /**
   * @description Checks value is PromiseLike.
   * @param value Candidate value.
   * @returns True when value has then function.
   */
  isPromiseLike<TValue>(value: unknown): value is PromiseLike<TValue> {
    if (!Guards.isDefined(value)) {
      return false
    }

    if (!Guards.isObjectRecord(value) && !Guards.isFunction(value)) {
      return false
    }

    const thenMember = (value as Dictionary<unknown>)['then']
    return Guards.isFunction(thenMember)
  },
} as const)
