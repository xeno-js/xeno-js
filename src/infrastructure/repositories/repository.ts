import type { IMapper, IRepository, IWriteDataSource, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { Optional, UserContext } from '@/shared'
import { Guards } from '@/shared'

/**
 * A generic repository implementation that provides basic CRUD operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IWriteDataSource to perform database operations and an IMapper to convert between entities and DTOs.
 * @template T - The type of the entity that the repository will manage.
 * @template TDto - The type of the Data Transfer Object (DTO) used for data access.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class Repository<T, TDto> implements IRepository<T> {
  /**
   * Constructs a new Repository instance.
   * @param _dataSource An instance of IWriteDataSource used to execute SQL queries and commands for data access.
   * @param _mapper An instance of IMapper used to convert between entities and DTOs.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  constructor(
    private readonly _dataSource: IWriteDataSource<TDto>,
    private readonly _mapper: IMapper<T, TDto>,
  ) {}

  public async findById(
    id: string | number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<Optional<T>>> {
    AppError.throwIfAborted(signal, 'Repository.findById')

    const result = await this._dataSource.findById(id, ctx, signal)
    if (Guards.isNullOrEmpty(result)) return Result.ok()

    const entity = this._mapper.toEntity(result)
    return Result.ok(entity)
  }

  public async find(
    filter: unknown,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<T[]>> {
    AppError.throwIfAborted(signal, 'Repository.find')

    const results = await this._dataSource.find(filter, ctx, signal)
    const entities = results.map((result) => this._mapper.toEntity(result))
    return Result.ok(entities)
  }

  public async save(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
    const dto = this._mapper.toDto(entity)

    AppError.throwIfAborted(signal, 'Repository.save')

    await this._dataSource.insert(dto, signal)
    return Result.ok()
  }

  public async delete(
    entity: T,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<void>> {
    const dto = this._mapper.toDto(entity)

    AppError.throwIfAborted(signal, 'Repository.delete')

    await this._dataSource.delete(dto, ctx, signal)
    return Result.ok()
  }

  public async update(
    id: string | number,
    entity: Partial<T>,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<void>> {
    const dto = this._mapper.toPartialDto(entity)

    AppError.throwIfAborted(signal, 'Repository.update')

    await this._dataSource.update(id, dto, ctx, signal)
    return Result.ok()
  }
}
