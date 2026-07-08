import type { Dictionary, Maybe } from '../types/common.types'

const OBJECT_TAG = '[object Object]'
const DATE_TAG = '[object Date]'

/**
 * @description Centralized type guards and runtime predicates.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const Guards = Object.freeze({
  /**
   * @description Checks value is neither null nor undefined.
   * @param value Candidate value.
   * @returns True when value is defined.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isDefined<TValue>(value: Maybe<TValue>): value is TValue {
    return value !== null && value !== undefined && value !== '' && !Number.isNaN(value)
  },

  /**
   * @description Checks value is null, undefined, empty string, or false.
   * @param value Candidate value.
   * @returns True when value is null, undefined, empty string, or false.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isString(value: unknown): value is string {
    return typeof value === 'string'
  },

  /**
   * @description Checks value is a finite number.
   * @param value Candidate value.
   * @returns True when value is finite number.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value)
  },

  /**
   * @description Checks value is an integer number.
   * @param value Candidate value.
   * @returns True when value is integer number.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isInteger(value: unknown): value is number {
    return Guards.isNumber(value) && Number.isInteger(value)
  },

  /**
   * @description Checks value is boolean.
   * @param value Candidate value.
   * @returns True when value is boolean.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  },

  /**
   * @description Checks value is bigint.
   * @param value Candidate value.
   * @returns True when value is bigint.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  },

  /**
   * @description Checks value is symbol.
   * @param value Candidate value.
   * @returns True when value is symbol.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol'
  },

  /**
   * @description Checks value is a function.
   * @param value Candidate value.
   * @returns True when value is function.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isFunction(value: unknown): value is (...args: readonly unknown[]) => unknown {
    return typeof value === 'function'
  },

  /**
   * @description Checks value is an array.
   * @param value Candidate value.
   * @returns True when value is array.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isArray<TValue>(value: unknown): value is TValue[] {
    return Array.isArray(value)
  },

  /**
   * @description Checks value is a Date instance with valid timestamp.
   * @param value Candidate value.
   * @returns True when value is valid Date.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isError(value: unknown): value is Error {
    return value instanceof Error
  },

  /**
   * @description Checks value is a plain object record.
   * @param value Candidate value.
   * @returns True when value is object record.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isObject(value: unknown): value is object {
    return typeof value === 'object' && Guards.isDefined(value)
  },

  /**
   * @description Checks value is PromiseLike.
   * @param value Candidate value.
   * @returns True when value has then function.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isPromiseLike<TValue>(value: unknown): value is PromiseLike<TValue> {
    if (!Guards.isDefined(value)) {
      return false
    }

    if (!Guards.isObject(value) && !Guards.isFunction(value)) {
      return false
    }

    const thenMember = (value as Dictionary<unknown>)['then']
    return Guards.isFunction(thenMember)
  },
} as const)
