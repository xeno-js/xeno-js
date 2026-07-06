import { describe, expect, it, vi } from 'vitest'

import type { IMapper, IWriteDataSource } from '@/domain'
import type { Optional, UserContext } from '@/shared'

import { Repository } from '../repository'

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

class TestRepository extends Repository<Entity, Dto> {
  constructor(dataSource: IWriteDataSource<Dto>, mapper: IMapper<Entity, Dto>) {
    super(dataSource, mapper)
  }
}

function makeDeps() {
  const findByIdMock = vi.fn()
  const findMock = vi.fn()
  const insertMock = vi.fn()
  const deleteMock = vi.fn()
  const updateMock = vi.fn()

  const toEntityMock = vi.fn()
  const toDtoMock = vi.fn()
  const toPartialDtoMock = vi.fn()

  const dataSource = {
    findById: findByIdMock,
    find: findMock,
    insert: insertMock,
    delete: deleteMock,
    update: updateMock,
  } as unknown as IWriteDataSource<Dto>

  const mapper = {
    toEntity: toEntityMock,
    toDto: toDtoMock,
    toPartialDto: toPartialDtoMock,
  } as unknown as IMapper<Entity, Dto>

  return {
    dataSource,
    mapper,
    mocks: {
      findByIdMock,
      findMock,
      insertMock,
      deleteMock,
      updateMock,
      toEntityMock,
      toDtoMock,
      toPartialDtoMock,
    },
  }
}

describe('Repository', () => {
  it('findById returns ok(undefined) when datasource returns undefined', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findByIdMock.mockResolvedValue(undefined)

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.findById('1', userContext, signal)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', userContext, signal)
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findById returns ok(undefined) when datasource returns null', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findByIdMock.mockResolvedValue(null)

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.findById('1', userContext, signal)

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

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.findById('1', userContext, signal)

    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', userContext, signal)
    expect(mocks.toEntityMock).toHaveBeenCalledWith(dto)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(entity)
  })

  it('findById throws when signal is already aborted', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const abortController = new AbortController()
    abortController.abort()

    const repo = new TestRepository(dataSource, mapper)

    await expect(repo.findById('1', userContext, abortController.signal)).rejects.toThrowError()
    expect(mocks.findByIdMock).not.toHaveBeenCalled()
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
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

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.find(dtos[0].fullName, userContext, signal)

    expect(mocks.findMock).toHaveBeenCalledWith(dtos[0].fullName, userContext, signal)
    expect(mocks.toEntityMock).toHaveBeenCalledTimes(2)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(entities)
  })

  it('find returns ok(empty list) when datasource returns no records', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findMock.mockResolvedValue([])

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.find('123', userContext, signal)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual([])
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('find throws when signal is already aborted', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const abortController = new AbortController()
    abortController.abort()

    const repo = new TestRepository(dataSource, mapper)

    await expect(repo.find('123', userContext, abortController.signal)).rejects.toThrowError()
    expect(mocks.findMock).not.toHaveBeenCalled()
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('save maps entity to dto, calls insert and returns ok(void)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const entity: Entity = { id: '1', name: 'Alice' }
    const dto: Dto = { id: '1', fullName: 'Alice' }

    mocks.toDtoMock.mockReturnValue(dto)

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.save(entity, signal)

    expect(mocks.toDtoMock).toHaveBeenCalledWith(entity)
    expect(mocks.insertMock).toHaveBeenCalledWith(dto, signal)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
  })

  it('save throws when signal is already aborted', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const entity: Entity = { id: '1', name: 'Alice' }
    const abortController = new AbortController()
    abortController.abort()

    const repo = new TestRepository(dataSource, mapper)

    await expect(repo.save(entity, abortController.signal)).rejects.toThrowError()
    expect(mocks.toDtoMock).toHaveBeenCalled()
    expect(mocks.insertMock).not.toHaveBeenCalled()
  })

  it('delete maps entity to dto, calls delete and returns ok(void)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const entity: Entity = { id: '1', name: 'Alice' }
    const dto: Dto = { id: '1', fullName: 'Alice' }

    mocks.toDtoMock.mockReturnValue(dto)

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.delete(entity, userContext, signal)

    expect(mocks.toDtoMock).toHaveBeenCalledWith(entity)
    expect(mocks.deleteMock).toHaveBeenCalledWith(dto, userContext, signal)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
  })

  it('delete throws when signal is already aborted', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const entity: Entity = { id: '1', name: 'Alice' }
    const abortController = new AbortController()
    abortController.abort()

    const repo = new TestRepository(dataSource, mapper)

    await expect(repo.delete(entity, userContext, abortController.signal)).rejects.toThrowError()
    expect(mocks.toDtoMock).toHaveBeenCalled()
    expect(mocks.deleteMock).not.toHaveBeenCalled()
  })

  it('update maps partial entity to partial dto, calls update and returns ok(void)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const partialEntity: Partial<Entity> = { name: 'Bob' }
    const partialDto: Partial<Dto> = { fullName: 'Bob' }

    mocks.toPartialDtoMock.mockReturnValue(partialDto)

    const repo = new TestRepository(dataSource, mapper)
    const signal = undefined as Optional<AbortSignal>
    const result = await repo.update('1', partialEntity, userContext, signal)

    expect(mocks.toPartialDtoMock).toHaveBeenCalledWith(partialEntity)
    expect(mocks.updateMock).toHaveBeenCalledWith('1', partialDto, userContext, signal)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
  })

  it('update throws when signal is already aborted', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const partialEntity: Partial<Entity> = { name: 'Bob' }
    const abortController = new AbortController()
    abortController.abort()

    const repo = new TestRepository(dataSource, mapper)

    await expect(
      repo.update('1', partialEntity, userContext, abortController.signal),
    ).rejects.toThrowError()
    expect(mocks.toPartialDtoMock).toHaveBeenCalled()
    expect(mocks.updateMock).not.toHaveBeenCalled()
  })
})
