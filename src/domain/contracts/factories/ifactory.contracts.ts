import type { Factory } from '@/shared'

/**
 * @description Generic factory type for creating instances of a given type `T`.
 * The factory can be used in two ways: as a simple provider that takes no arguments, or as a parameterized creator that accepts a single input of type `TInput`.
 *
 * @template TInput  The type of the input parameter for the factory method.
 * @template TOutput The type of the output produced by the factory method.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IFactory<TInput, TOutput> {
  /**
   * Creates an instance of `Output` using the provided `input` of type `TInput`.
   * @param input The input data required to create the instance.
   * @returns An instance of type `Output`.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  create: Factory<TOutput, [TInput]>
}
