/** @description Constants related to request handling in the application. */
export const REQUEST_TYPE = Object.freeze({
  /** @description A request that intends to modify state (e.g. create, update, delete). */
  COMMAND: 'COMMAND',
  /** @description A request that intends to retrieve data without modifying state. */
  QUERY: 'QUERY',
} as const)

/** @description Inferred union of every valid REQUEST_TYPE value. */
export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE]
