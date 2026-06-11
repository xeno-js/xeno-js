import { describe, expect, it } from 'vitest'

import { TokenHelper } from '@/shared'

describe('TokenHelper', () => {
  describe('immutability', () => {
    it('TokenHelper is frozen', () => {
      expect(Object.isFrozen(TokenHelper)).toBe(true)
    })
  })

  describe('createToken', () => {
    it('returns an object with a symbol property', () => {
      const token = TokenHelper.createToken<string>('MY_TOKEN')
      expect(token).toHaveProperty('symbol')
    })

    it('the symbol property is of type symbol', () => {
      const token = TokenHelper.createToken<number>('MY_NUMBER_TOKEN')
      expect(typeof token.symbol).toBe('symbol')
    })

    it('the symbol description matches the provided string', () => {
      const description = 'USER_SERVICE'
      const token = TokenHelper.createToken<unknown>(description)
      expect(token.symbol.description).toBe(description)
    })

    it('two calls with the same description produce distinct symbols', () => {
      const token1 = TokenHelper.createToken<string>('SAME')
      const token2 = TokenHelper.createToken<string>('SAME')
      expect(token1.symbol).not.toBe(token2.symbol)
    })

    it('two calls with different descriptions produce distinct symbols', () => {
      const token1 = TokenHelper.createToken<string>('TOKEN_A')
      const token2 = TokenHelper.createToken<string>('TOKEN_B')
      expect(token1.symbol).not.toBe(token2.symbol)
    })

    it('works with an empty string description', () => {
      const token = TokenHelper.createToken<boolean>('')
      expect(typeof token.symbol).toBe('symbol')
      expect(token.symbol.description).toBe('')
    })
  })
})
