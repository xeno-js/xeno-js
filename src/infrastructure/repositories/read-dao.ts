import type { IMapper, IReadDao, IReadDataSource, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { Optional, ReadCriteria } from '@/shared'
import { Guards } from '@/shared'

/**
 * A generic repository implementation that provides basic CRUD operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IReadDataSource to perform database operations and an IMapper to convert between entities and DTOs.
 * @template T - The type of the entity that the repository will manage.
 * @template TDto - The type of the Data Transfer Object (DTO) used for data access.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export class ReadDao<T, TDto> implements IReadDao<T> {
  /**
   * Constructs a new ReadDao instance.
   * @param _dataSource An instance of IReadDataSource used to execute SQL queries and commands for data access.
   * @param _mapper An instance of IMapper used to convert between entities and DTOs.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  constructor(
    private readonly _dataSource: IReadDataSource<TDto>,
    private readonly _mapper: IMapper<T, TDto>,
  ) {}

  public async findById(
    id: string,
    criteria: ReadCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<Optional<T>>> {
    const result = await this._dataSource.findById(id, criteria, signal)
    if (Guards.isNullOrEmpty(result)) return Result.ok()

    const entity = this._mapper.toEntity(result)
    return Result.ok(entity)
  }

  public async find(
    criteria: ReadCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<T[]>> {
    const results = await this._dataSource.find(criteria, signal)
    const entities = results.map((result) => this._mapper.toEntity(result))
    return Result.ok(entities)
  }
}
