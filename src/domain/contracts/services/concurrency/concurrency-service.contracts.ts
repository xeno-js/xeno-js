/**
 * @description The IConcurrencyService interface provides a contract for executing multiple asynchronous tasks in parallel while strictly controlling the maximum number of concurrent executions. This is crucial for protecting system resources (CPU, RAM) and avoiding event loop blocking during massive batch operations (e.g., processing large CSV files, bulk database inserts).

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IConcurrencyService {
  /**
   * @description Executes an array of asynchronous tasks in parallel, limiting the number of tasks running at the exact same time.
   * @param tasks An array of functions, where each function returns a Promise representing the asynchronous task to be executed.
   * @param concurrencyLimit The maximum number of promises allowed to run concurrently.
   * @returns A Promise that resolves to an array containing the results of all tasks, in the same order as the input array.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  executeInParallel<T>(tasks: (() => Promise<T>)[], concurrencyLimit: number): Promise<T[]>
}
