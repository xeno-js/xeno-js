import { describe, expect, it } from 'vitest'

import { ClientIpResolver } from '../client-ip.resolver'

describe('ClientIpResolver', () => {
  it('returns undefined when there is no socket IP and no client IP', () => {
    const resolver = new ClientIpResolver()

    expect(resolver.resolve({}, undefined)).toBeUndefined()
  })

  it('uses the first forwarded client IP when no socket IP is available', () => {
    const resolver = new ClientIpResolver()

    expect(resolver.resolve({}, ' 203.0.113.9, 198.51.100.7 ')).toBe('203.0.113.9')
  })

  it('returns the socket IP when it is not trusted and a proxy is present', () => {
    const resolver = new ClientIpResolver(['10.0.0.2'])

    expect(resolver.resolve({ socket: { remoteAddress: '203.0.113.42' } }, '198.51.100.1')).toBe(
      '203.0.113.42',
    )
  })

  it('prefers the forwarded client IP when the socket IP is a trusted proxy', () => {
    const resolver = new ClientIpResolver(['10.0.0.2'])

    expect(
      resolver.resolve({ socket: { remoteAddress: '10.0.0.2' } }, ' 198.51.100.1, 10.0.0.9 '),
    ).toBe('198.51.100.1')
  })

  it('falls back to the socket IP when a trusted proxy sends no forwarded client IP', () => {
    const resolver = new ClientIpResolver(['10.0.0.2'])

    expect(resolver.resolve({ socket: { remoteAddress: '10.0.0.2' } }, undefined)).toBe('10.0.0.2')
  })
})
