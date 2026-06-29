import { describe, expect, it } from 'vitest'

import { GUEST } from '@/shared'

import { NoAuthGateKeeper } from '../noauth.gate-keeper'

describe('NoAuthGateKeeper', () => {
  const gateKeeper = new NoAuthGateKeeper()

  it('should return GUEST identity when no token is provided', async () => {
    const result = await gateKeeper.authenticate(undefined)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(GUEST)
  })

  it('should return GUEST identity even when a token is provided', async () => {
    // Il punto della NoAuthGateKeeper è ignorare qualsiasi token
    const result = await gateKeeper.authenticate('any-random-token')

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(GUEST)
  })
})
