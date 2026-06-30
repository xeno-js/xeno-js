import type { IDbClient, IFilterBuilder, IWriteDataSource } from '@/domain'
import type { Optional, WriteCriteria } from '@/shared'

/**
 * The AbstractWriteDataSource class is an implementation of the IWriteDataSource interface that provides methods for writing data to a database using a specified IDbClient and IFilterBuilder. This class is designed to be used as a data source for write operations in a repository pattern, allowing for separation of concerns and easier testing. The AbstractWriteDataSource class takes care of building the appropriate filters based on the provided criteria and executing the write queries against the database using the IDbClient.
 * @template TDto - The type of the data transfer object (DTO) that represents the data being written to the database.
 * @template TQueryConditions - The type of the query conditions object that is built using the IFilterBuilder to specify the criteria for writing data to the database.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export abstract class AbstractWriteDataSource<
  TDto extends object,
  TQueryConditions = unknown,
> implements IWriteDataSource<TDto> {
  constructor(
    protected readonly _dbClient: IDbClient<TQueryConditions>,
    protected readonly _tableName: string,
    private readonly _filter: IFilterBuilder<TQueryConditions>,
  ) {}

  public async find(criteria: WriteCriteria, signal: Optional<AbortSignal>): Promise<TDto[]> {
    const filter = this._filter.buildFindCriteria(criteria)
    return await this._dbClient.select<TDto>(this._tableName, filter, undefined, signal)
  }

  public async findById(id: string, signal: Optional<AbortSignal>): Promise<Optional<TDto>> {
    const filter = this._filter.buildQueryCriteria({ id })
    return await this._dbClient.selectOne<TDto>(this._tableName, filter, undefined, signal)
  }

  public async insert(dto: TDto, signal: Optional<AbortSignal>): Promise<void> {
    await this._dbClient.insert(dto, this._tableName, signal)
  }

  public async delete(dto: TDto, signal: Optional<AbortSignal>): Promise<void> {
    const filter = this._filter.buildDeleteCriteria(dto)
    await this.performDelete(dto, filter, signal)
  }

  public async update(
    dto: Partial<TDto>,
    criteria: WriteCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    const filter = this._filter.buildUpdateCriteria(criteria)
    await this._dbClient.update(dto, this._tableName, filter, signal)
  }

  /**
   * The performDelete method is an abstract method that must be implemented by subclasses of AbstractWriteDataSource. This method is responsible for executing the delete operation against the database using the provided DTO, filter, and optional AbortSignal. The implementation of this method will depend on the specific requirements of the delete operation, such as whether it should perform a hard delete (removing the record from the database) or a soft delete (marking the record as deleted without actually removing it). By making this method abstract, the AbstractWriteDataSource class allows for flexibility in how delete operations are handled while still providing a common interface for write data sources.
   * @param dto The data transfer object representing the data to be deleted.
   * @param filter The filter object built using the IFilterBuilder to specify the criteria for deleting data from the database.
   * @param signal An optional AbortSignal to allow cancellation of the delete operation.
   * @returns A promise that resolves when the delete operation has been executed successfully.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  protected abstract performDelete(
    dto: TDto,
    filter: Optional<TQueryConditions>,
    signal: Optional<AbortSignal>,
  ): Promise<void>
}
