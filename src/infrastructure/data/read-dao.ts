import type { IBaseDataSource, IMapper, IReadDao, ResultType, UniqueId } from '@/domain'
import { Result } from '@/domain'
import type { IPaginationParams, Maybe, Optional } from '@/shared'
import { Guards } from '@/shared'

/**
 * A generic repository implementation that provides basic CRUD operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IBaseDataSource to perform database operations and an IMapper to convert between entities and DTOs.
 * @template T - The type of the entity that the repository will manage.
 * @template TDto - The type of the Data Transfer Object (DTO) used for data access.
 * @template TFilter - The type of the filter used for querying data.
 */
export class ReadDao<T, TDto, TFilter = IPaginationParams> implements IReadDao<T, TFilter> {
  /**
   * Constructs a new ReadDao instance.
   * @param _dataSource An instance of IBaseDataSource used to execute SQL queries and commands for data access.
   * @param _mapper An instance of IMapper used to convert between entities and DTOs.
   */
  constructor(
    private readonly _dataSource: IBaseDataSource<TDto, TFilter>,
    protected readonly _mapper: IMapper<T, TDto>,
  ) {}

  public async findById(
    id: UniqueId,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<Maybe<T>>> {
    const result = await this._dataSource.findById(id.toString(), signal)
    if (Guards.isNullOrEmpty(result)) return Result.ok(result)

    const entity = this._mapper.toEntity(result)
    return Result.ok(entity)
  }

  public async find(filter: TFilter, signal: Optional<AbortSignal>): Promise<ResultType<T[]>> {
    const results = await this._dataSource.find(filter, signal)
    const entities = results.map((result) => this._mapper.toEntity(result))
    return Result.ok(entities)
  }
}
