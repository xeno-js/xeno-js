import type { HttpMethod } from '@xeno-js/shared'

export interface IAllowMethod {
  check(path: string, method: HttpMethod): boolean
}
