import { describe, expect, it, vi } from 'vitest'

import type { IMapper, IReadDataSource } from '@/domain'
import type { Optional, ReadCriteria } from '@/shared'

import { ReadDao } from '../read-dao'

interface Entity {
  id: string
  name: string
}

interface Dto {
  id: string
  fullName: string
}

function makeDeps() {
  const findByIdMock = vi.fn()
  const findMock = vi.fn()

  const toEntityMock = vi.fn()

  const dataSource = {
    findById: findByIdMock,
    find: findMock,
  } as unknown as IReadDataSource<Dto>

  const mapper = {
    toEntity: toEntityMock,
  } as unknown as IMapper<Entity, Dto>

  return {
    dataSource,
    mapper,
    mocks: {
      findByIdMock,
      findMock,
      toEntityMock,
    },
  }
}

describe('ReadDao', () => {
  it('findById returns ok(undefined) when datasource returns undefined', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findByIdMock.mockResolvedValue(undefined)

    const dao = new ReadDao<Entity, Dto>(dataSource, mapper)
    const criteria = undefined as unknown as ReadCriteria
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.findById('1', criteria, signal)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', criteria, signal)
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findById returns ok(undefined) when datasource returns null', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findByIdMock.mockResolvedValue(null)

    const dao = new ReadDao<Entity, Dto>(dataSource, mapper)
    const criteria = undefined as unknown as ReadCriteria
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.findById('1', criteria, signal)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', criteria, signal)
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findById maps dto to entity when datasource returns a record', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const dto: Dto = { id: '1', fullName: 'Alice' }
    const entity: Entity = { id: '1', name: 'Alice' }

    mocks.findByIdMock.mockResolvedValue(dto)
    mocks.toEntityMock.mockReturnValue(entity)

    const dao = new ReadDao<Entity, Dto>(dataSource, mapper)
    const criteria = undefined as unknown as ReadCriteria
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.findById('1', criteria, signal)

    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', criteria, signal)
    expect(mocks.toEntityMock).toHaveBeenCalledWith(dto)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(entity)
  })

  it('find maps every dto to entity and returns ok(list)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const dtos: Dto[] = [
      { id: '1', fullName: 'Alice' },
      { id: '2', fullName: 'Bob' },
    ]
    const entities: Entity[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]

    mocks.findMock.mockResolvedValue(dtos)
    mocks.toEntityMock.mockReturnValueOnce(entities[0]).mockReturnValueOnce(entities[1])

    const dao = new ReadDao<Entity, Dto>(dataSource, mapper)
    const criteria: ReadCriteria = {
      where: [],
      limit: null,
      offset: null,
      orderBy: null,
      cols: undefined,
    }
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.find(criteria, signal)

    expect(mocks.findMock).toHaveBeenCalledWith(criteria, signal)
    expect(mocks.toEntityMock).toHaveBeenCalledTimes(2)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(entities)
  })

  it('find returns ok(empty list) when datasource returns no records', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findMock.mockResolvedValue([])

    const dao = new ReadDao<Entity, Dto>(dataSource, mapper)
    const criteria: ReadCriteria = {
      where: [],
      limit: null,
      offset: null,
      orderBy: null,
      cols: undefined,
    }
    const result = await dao.find(criteria, undefined)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual([])
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })
})
