import type { Optional } from '@xeno-js/shared'
import { Guards } from '@xeno-js/shared'

interface HasRemoteSocket {
  readonly socket?: {
    readonly remoteAddress?: string
  }
  readonly connection?: {
    readonly remoteAddress?: string
  }
}

/**
 * @description SocketIpExtractor extracts the IP address of the remote socket from an incoming request. It checks for the presence of a 'socket' or 'connection' property in the request object and returns the 'remoteAddress' value if available. If the request object is not defined or not an object, it returns undefined.
 */
export const SocketIpExtractor = Object.freeze({
  /**
   * @description Extracts the IP address of the remote socket from an incoming request.
   * @param req The incoming request object.
   * @returns The IP address of the remote socket, or undefined if not available.
   */
  extract<T>(req: T): Optional<string> {
    if (Guards.isDefined(req) && Guards.isObject(req)) {
      const candidate = req as HasRemoteSocket
      return candidate.socket?.remoteAddress ?? candidate.connection?.remoteAddress
    }
    return undefined
  },
} as const)
