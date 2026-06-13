import { describe, expect, it } from 'vitest'

import { ValueObject } from '@/domain'

interface TestProps {
  name: string
  age: number
}

class TestValueObject extends ValueObject<TestProps> {
  constructor(props: TestProps) {
    super(props)
  }
}

describe('ValueObject', () => {
  it('creates a ValueObject with the provided properties', () => {
    const vo = new TestValueObject({ name: 'Alice', age: 30 })
    expect(vo.getValue()).toEqual({ name: 'Alice', age: 30 })
  })

  it('equals returns true for ValueObjects with the same properties', () => {
    const vo1 = new TestValueObject({ name: 'Alice', age: 30 })
    const vo2 = new TestValueObject({ name: 'Alice', age: 30 })
    expect(vo1.equals(vo2)).toBe(true)
  })

  it('equals returns false for ValueObjects with different properties', () => {
    const vo1 = new TestValueObject({ name: 'Alice', age: 30 })
    const vo2 = new TestValueObject({ name: 'Bob', age: 25 })
    expect(vo1.equals(vo2)).toBe(false)
  })

  it('equals returns false when comparing with a non-ValueObject', () => {
    const vo = new TestValueObject({ name: 'Alice', age: 30 })
    const nonVO = undefined
    expect(vo.equals(nonVO)).toBe(false)
  })

  it('equals returns false when comparing with a value object with different properties', () => {
    const vo = new TestValueObject({ name: 'Alice', age: 30 })
    const nonVO = new TestValueObject({ name: 'Alice', age: 25 })
    expect(vo.equals(nonVO)).toBe(false)
  })

  it('equals returns false when comparing with a value object with an empty properties', () => {
    const vo = new TestValueObject({ name: 'Alice', age: 30 })
    const nonVO = new TestValueObject(undefined as unknown as TestProps)
    expect(vo.equals(nonVO)).toBe(false)
  })

  it('toString returns the string representation of the ValueObject', () => {
    const vo = new TestValueObject({ name: 'Alice', age: 30 })
    expect(vo.toString()).toBe(JSON.stringify({ name: 'Alice', age: 30 }))
  })
})
