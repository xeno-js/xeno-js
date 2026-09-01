import { describe, expect, it } from 'vitest'

import { UniqueId } from '@/domain'
import { GuidHelper } from '@/shared'

import { Entity } from '../entity'

interface SampleProps {
  name: string
  tags: string[]
}

class SampleEntity extends Entity<SampleProps> {
  constructor(props: SampleProps, id?: string) {
    super(props, id)
  }
}

describe('Entity', () => {
  it('creates a new UniqueId when no id is provided', () => {
    const props: SampleProps = { name: 'alice', tags: ['admin'] }

    const entity = new SampleEntity(props)

    expect(entity.id).toBeInstanceOf(UniqueId)
    expect(entity.getProps()).toEqual(props)
  })

  it('uses the provided UniqueId when it is valid', () => {
    const props: SampleProps = { name: 'bob', tags: ['user'] }
    const id = GuidHelper.generate()

    const entity = new SampleEntity(props, id)

    expect(entity.id.getValue()).toBe(id)
    expect(entity.getProps()).toEqual(props)
  })

  it('throws when an invalid UniqueId is provided', () => {
    const props: SampleProps = { name: 'carol', tags: [] }
    const invalidId = 'not-a-guid'

    expect(() => new SampleEntity(props, invalidId)).toThrow(
      `Invalid UniqueId provided: ${invalidId}.`,
    )
  })

  it('getProps returns the properties of the entity', () => {
    const props: SampleProps = { name: 'dave', tags: ['editor'] }
    const entity = new SampleEntity(props)

    expect(entity.getProps()).toEqual(props)
  })

  it('properties are immutable', () => {
    const props: SampleProps = { name: 'eve', tags: ['viewer'] }
    const entity = new SampleEntity(props)

    const retrievedProps = entity.getProps()
    retrievedProps.name = 'mallory'
    retrievedProps.tags.push('hacker')

    expect(entity.getProps()).toEqual(props)
  })

  it('entity instance is frozen', () => {
    const props: SampleProps = { name: 'frank', tags: ['contributor'] }
    const entity = new SampleEntity(props)

    expect(Object.isFrozen(entity)).toBe(true)
  })

  it('getId returns the UniqueId of the entity', () => {
    const props: SampleProps = { name: 'grace', tags: ['moderator'] }
    const entity = new SampleEntity(props)

    expect(entity.getId()).toBe(entity.id)
  })
})
