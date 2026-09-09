import type { IMapper, IReadDataSource } from '@xeno-js/shared'
import type { Optional, UserContext } from '@xeno-js/shared'
import { describe, expect, it, vi } from 'vitest'

import { ReadDao } from '../read-dao'

interface Entity {
  id: string
  name: string
}

interface Dto {
  id: string
  fullName: string
}

const userContext: UserContext = {
  userId: 'd108b2d2-1df8-45ca-8a27-686f9f443269',
  tenantId: '6fdeff88-9f53-4c58-b24f-2e2db77d95ce',
}

class TestReadDao extends ReadDao<Entity, Dto> {
  constructor(dataSource: IReadDataSource<Dto>, mapper: IMapper<Entity, Dto>) {
    super(dataSource, mapper)
  }
}

function makeDeps() {
  const findByIdMock = vi.fn()
  const findAllMock = vi.fn()

  const toEntityMock = vi.fn()

  const dataSource = {
    findById: findByIdMock,
    findAll: findAllMock,
  } as unknown as IReadDataSource<Dto>

  const mapper = {
    toEntity: toEntityMock,
  } as unknown as IMapper<Entity, Dto>

  return {
    dataSource,
    mapper,
    mocks: {
      findByIdMock,
      findAllMock,
      toEntityMock,
    },
  }
}

describe('ReadDao', () => {
  it('findById returns ok(undefined) when datasource returns undefined', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findByIdMock.mockResolvedValue(undefined)

    const dao = new TestReadDao(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.findById('1', userContext, signal)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', userContext, signal)
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findById returns ok(undefined) when datasource returns null', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findByIdMock.mockResolvedValue(null)

    const dao = new TestReadDao(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.findById('1', userContext, signal)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', userContext, signal)
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findById maps dto to entity when datasource returns a record', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const dto: Dto = { id: '1', fullName: 'Alice' }
    const entity: Entity = { id: '1', name: 'Alice' }

    mocks.findByIdMock.mockResolvedValue(dto)
    mocks.toEntityMock.mockReturnValue(entity)

    const dao = new TestReadDao(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.findById('1', userContext, signal)

    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', userContext, signal)
    expect(mocks.toEntityMock).toHaveBeenCalledWith(dto)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(entity)
  })

  it('findById throws when signal is already aborted', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const abortController = new AbortController()
    abortController.abort()

    const dao = new TestReadDao(dataSource, mapper)

    await expect(dao.findById('1', userContext, abortController.signal)).rejects.toThrowError()
    expect(mocks.findByIdMock).not.toHaveBeenCalled()
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findAll maps every dto to entity and returns ok(list)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const dtos: Dto[] = [
      { id: '1', fullName: 'Alice' },
      { id: '2', fullName: 'Bob' },
    ]
    const entities: Entity[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]

    mocks.findAllMock.mockResolvedValue(dtos)
    mocks.toEntityMock.mockReturnValueOnce(entities[0]).mockReturnValueOnce(entities[1])

    const dao = new TestReadDao(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await dao.findAll(userContext, signal)

    expect(mocks.findAllMock).toHaveBeenCalledWith(userContext, signal)
    expect(mocks.toEntityMock).toHaveBeenCalledTimes(2)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(entities)
  })

  it('findAll returns ok(empty list) when datasource returns no records', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findAllMock.mockResolvedValue([])

    const dao = new TestReadDao(dataSource, mapper)
    const result = await dao.findAll(userContext, undefined)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual([])
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findAll throws when signal is already aborted', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const abortController = new AbortController()
    abortController.abort()

    const dao = new TestReadDao(dataSource, mapper)

    await expect(dao.findAll(userContext, abortController.signal)).rejects.toThrowError()
    expect(mocks.findAllMock).not.toHaveBeenCalled()
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })
})
