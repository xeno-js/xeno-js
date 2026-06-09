import type { IDataSource, IFilter, IMapper, IRepository, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { Maybe, Optional } from '@/shared'
import { Guards } from '@/shared'

/**
 * A generic repository implementation that provides basic CRUD operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IDataSource to perform database operations and an IMapper to convert between entities and DTOs.
 * @template T - The type of the entity that the repository will manage.
 * @template TDto - The type of the Data Transfer Object (DTO) used for data access.
 */
export class Repository<T, TDto> implements IRepository<T> {
  /**
   * Constructs a new Repository instance.
   * @param _dataSource An instance of IDataSource used to execute SQL queries and commands for data access.
   * @param _mapper An instance of IMapper used to convert between entities and DTOs.
   */
  constructor(
    private readonly _dataSource: IDataSource<TDto>,
    private readonly _mapper: IMapper<T, TDto>,
  ) {}

  public async findById(id: string, signal: Optional<AbortSignal>): Promise<ResultType<Maybe<T>>> {
    const result = await this._dataSource.findById(id, signal)
    if (Guards.isNullOrEmpty(result)) return Result.ok(result)

    const entity = this._mapper.toEntity(result)
    return Result.ok(entity)
  }

  public async find(filter: IFilter, signal: Optional<AbortSignal>): Promise<ResultType<T[]>> {
    const results = await this._dataSource.find(filter, signal)
    const entities = results.map((result) => this._mapper.toEntity(result))
    return Result.ok(entities)
  }

  public async save(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
    const dto = this._mapper.toDto(entity)
    await this._dataSource.insert(dto, signal)
    return Result.ok()
  }

  public async delete(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
    const dto = this._mapper.toDto(entity)
    await this._dataSource.delete(dto, signal)
    return Result.ok()
  }
}
