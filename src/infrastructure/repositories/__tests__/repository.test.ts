import { describe, expect, it, vi } from 'vitest'

import type { IMapper, IWriteDataSource } from '@/domain'
import type { WriteCriteria } from '@/shared'

import { Repository } from '../repository'

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

    const repo = new Repository<Entity, Dto>(dataSource, mapper)
    const result = await repo.findById('1', undefined)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findById returns ok(undefined) when datasource returns null', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    mocks.findByIdMock.mockResolvedValue(null)

    const repo = new Repository<Entity, Dto>(dataSource, mapper)
    const result = await repo.findById('1', undefined)

    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
    expect(mocks.toEntityMock).not.toHaveBeenCalled()
  })

  it('findById maps dto to entity when datasource returns a record', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const dto: Dto = { id: '1', fullName: 'Alice' }
    const entity: Entity = { id: '1', name: 'Alice' }

    mocks.findByIdMock.mockResolvedValue(dto)
    mocks.toEntityMock.mockReturnValue(entity)

    const repo = new Repository<Entity, Dto>(dataSource, mapper)
    const result = await repo.findById('1', undefined)

    expect(mocks.findByIdMock).toHaveBeenCalledWith('1', undefined)
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

    const repo = new Repository<Entity, Dto>(dataSource, mapper)
    const criteria: WriteCriteria = {
      where: [{ field: 'id', operator: 'eq', value: '1' }],
      relationsToLoad: undefined,
    }
    const result = await repo.find(criteria, undefined)

    expect(mocks.findMock).toHaveBeenCalledWith(criteria, undefined)
    expect(mocks.toEntityMock).toHaveBeenCalledTimes(2)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(entities)
  })

  it('save maps entity to dto, calls insert and returns ok(void)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const entity: Entity = { id: '1', name: 'Alice' }
    const dto: Dto = { id: '1', fullName: 'Alice' }

    mocks.toDtoMock.mockReturnValue(dto)

    const repo = new Repository<Entity, Dto>(dataSource, mapper)
    const result = await repo.save(entity, undefined)

    expect(mocks.toDtoMock).toHaveBeenCalledWith(entity)
    expect(mocks.insertMock).toHaveBeenCalledWith(dto, undefined)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
  })

  it('delete maps entity to dto, calls delete and returns ok(void)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const entity: Entity = { id: '1', name: 'Alice' }
    const dto: Dto = { id: '1', fullName: 'Alice' }

    mocks.toDtoMock.mockReturnValue(dto)

    const repo = new Repository<Entity, Dto>(dataSource, mapper)
    const result = await repo.delete(entity, undefined)

    expect(mocks.toDtoMock).toHaveBeenCalledWith(entity)
    expect(mocks.deleteMock).toHaveBeenCalledWith(dto, undefined)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
  })

  it('update maps partial entity to partial dto, calls update and returns ok(void)', async () => {
    const { dataSource, mapper, mocks } = makeDeps()
    const partialEntity: Partial<Entity> = { name: 'Bob' }
    const partialDto: Partial<Dto> = { fullName: 'Bob' }
    const criteria: WriteCriteria = {
      where: [{ field: 'id', operator: 'eq', value: '1' }],
      relationsToLoad: undefined,
    }

    mocks.toPartialDtoMock.mockReturnValue(partialDto)

    const repo = new Repository<Entity, Dto>(dataSource, mapper)
    const result = await repo.update(partialEntity, criteria, undefined)

    expect(mocks.toPartialDtoMock).toHaveBeenCalledWith(partialEntity)
    expect(mocks.updateMock).toHaveBeenCalledWith(partialDto, criteria, undefined)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBeUndefined()
  })
})
