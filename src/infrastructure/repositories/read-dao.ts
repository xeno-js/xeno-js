import type { IMapper, IReadDao, IReadDataSource, ResultType } from '@xeno-js/shared'
import type { Optional, UserContext } from '@xeno-js/shared'
import { AppError, Result } from '@xeno-js/shared'
import { Guards } from '@xeno-js/shared'

/**
 * An abstract generic read-only DAO that provides basic read operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IReadDataSource to perform database operations and an IMapper to convert between entities and DTOs.
 * @template T - The type of the entity that the DAO will manage.
 * @template TDto - The type of the Data Transfer Object (DTO) used for data access.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export abstract class ReadDao<T, TDto> implements IReadDao<T> {
  /**
   * Constructs a new ReadDao instance.
   * @param _dataSource An instance of IReadDataSource used to execute SQL queries and commands for data access.
   * @param _mapper An instance of IMapper used to convert between entities and DTOs.
   *
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  constructor(
    private readonly _dataSource: IReadDataSource<TDto>,
    private readonly _mapper: IMapper<T, TDto>,
  ) {}

  public async findById(
    id: string | number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<Optional<T>>> {
    AppError.throwIfAborted(signal, 'ReadDao.findById')
    const result = await this._dataSource.findById(id, ctx, signal)
    if (Guards.isNullOrEmpty(result)) return Result.ok()

    const entity = this._mapper.toEntity(result)
    return Result.ok(entity)
  }

  public async findAll(ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<T[]>> {
    AppError.throwIfAborted(signal, 'ReadDao.findAll')
    const results = await this._dataSource.findAll(ctx, signal)
    const entities = results.map((result) => this._mapper.toEntity(result))
    return Result.ok(entities)
  }
}
