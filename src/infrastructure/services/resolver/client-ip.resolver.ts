import type { Optional } from '@xeno-js/shared'
import { Guards } from '@xeno-js/shared'

import type { IIPResolver } from '@/domain'

import { SocketIpExtractor } from './utils'

/**
 * @description ClientIpResolver is a resolver that extracts the client IP address from the network context or the socket IP address.
 */
export class ClientIpResolver implements IIPResolver {
  constructor(private readonly _trustedProxies: string[] = []) {}

  public resolve<T>(req: T, clientIp: Optional<string>): Optional<string> {
    const socketIp = SocketIpExtractor.extract(req)

    if (!Guards.isDefined(socketIp))
      return !Guards.isNullOrEmpty(clientIp) ? clientIp.split(',')[0].trim() : undefined

    const isTrustedProxy = this._trustedProxies.includes(socketIp)
    if (!isTrustedProxy) return socketIp

    if (Guards.isDefined(clientIp)) return clientIp.split(',')[0].trim()

    return socketIp
  }
}
