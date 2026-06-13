import { describe, expect, it } from 'vitest'

import { UniqueId } from '@/domain'

describe('UniqueId', () => {
  it('creates a UniqueId with a valid UUID v4 string', () => {
    const uniqueId = UniqueId.create()
    const value = uniqueId.getValue()
    expect(value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('toString returns the string representation of the UniqueId', () => {
    const uniqueId = UniqueId.create()
    expect(uniqueId.toString()).toBe(uniqueId.getValue())
  })

  it('equals returns true for UniqueIds with the same value', () => {
    const uniqueId1 = UniqueId.create()
    const uniqueId2 = uniqueId1
    expect(uniqueId1.equals(uniqueId2)).toBe(true)
  })

  it('equals returns false for UniqueIds with different values', () => {
    const uniqueId1 = UniqueId.create()
    const uniqueId2 = UniqueId.create()
    expect(uniqueId1.equals(uniqueId2)).toBe(false)
  })

  it('equals returns false when comparing with a non-UniqueId object', () => {
    const uniqueId = UniqueId.create()
    const nonUniqueId = { getValue: () => uniqueId.getValue() } as unknown as UniqueId
    expect(uniqueId.equals(nonUniqueId)).toBe(false)
  })
})
