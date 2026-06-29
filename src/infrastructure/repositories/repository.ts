import type { IMapper, IRepository, IWriteDataSource, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { Optional, WriteCriteria } from '@/shared'
import { Guards } from '@/shared'

/**
 * A generic repository implementation that provides basic CRUD operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IWriteDataSource to perform database operations and an IMapper to convert between entities and DTOs.
 * @template T - The type of the entity that the repository will manage.
 * @template TDto - The type of the Data Transfer Object (DTO) used for data access.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class Repository<T, TDto> implements IRepository<T> {
  /**
   * Constructs a new Repository instance.
   * @param _dataSource An instance of IWriteDataSource used to execute SQL queries and commands for data access.
   * @param _mapper An instance of IMapper used to convert between entities and DTOs.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  constructor(
    private readonly _dataSource: IWriteDataSource<TDto>,
    private readonly _mapper: IMapper<T, TDto>,
  ) {}

  public async findById(
    id: string,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<Optional<T>>> {
    const result = await this._dataSource.findById(id, signal)
    if (Guards.isNullOrEmpty(result)) return Result.ok()

    const entity = this._mapper.toEntity(result)
    return Result.ok(entity)
  }

  public async find(
    criteria: WriteCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<T[]>> {
    const results = await this._dataSource.find(criteria, signal)
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

  public async update(
    entity: Partial<T>,
    criteria: WriteCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<void>> {
    const dto = this._mapper.toPartialDto(entity)
    await this._dataSource.update(dto, criteria, signal)
    return Result.ok()
  }
}
