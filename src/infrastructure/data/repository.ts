import type { IDataSource, IFilter, IMapper, IRepository, ResultType } from '@/domain'
import { Result } from '@/domain'
import { ReadDao } from '@/infrastructure'
import type { Optional } from '@/shared'

/**
 * A generic repository implementation that provides basic CRUD operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IDataSource to perform database operations and an IMapper to convert between entities and DTOs.
 * @template T - The type of the entity that the repository will manage.
 * @template TDto - The type of the Data Transfer Object (DTO) used for data access.
 */
export class Repository<T, TDto> extends ReadDao<T, TDto, IFilter> implements IRepository<T> {
  /**
   * Constructs a new Repository instance.
   * @param _dataSource An instance of IDataSource used to execute SQL queries and commands for data access.
   * @param _mapper An instance of IMapper used to convert between entities and DTOs.
   */
  constructor(
    private readonly _ds: IDataSource<TDto>,
    mapper: IMapper<T, TDto>,
  ) {
    super(_ds, mapper)
  }

  public async save(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
    const dto = this._mapper.toDto(entity)
    await this._ds.insert(dto, signal)
    return Result.ok()
  }

  public async delete(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
    const dto = this._mapper.toDto(entity)
    await this._ds.delete(dto, signal)
    return Result.ok()
  }
}
