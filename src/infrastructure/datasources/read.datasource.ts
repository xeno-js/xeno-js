import type { IDbClient, IFilterBuilder, IReadDataSource } from '@/domain'
import type { Optional, ReadCriteria } from '@/shared'

/**
 * The ReadDataSource class is an implementation of the IReadDataSource interface that provides methods for retrieving data from a database using a specified IDbClient and IFilterBuilder. This class is designed to be used as a data source for read operations in a repository pattern, allowing for separation of concerns and easier testing. The ReadDataSource class takes care of building the appropriate filters based on the provided criteria and executing the select queries against the database using the IDbClient.
 * @template Dto - The type of the data transfer object (DTO) that represents the data being retrieved from the database.
 * @template Filter - The type of the filter object that is built using the IFilterBuilder to specify the criteria for retrieving data from the database.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class ReadDataSource<
  TDto,
  TQueryConditions = unknown,
  TQueryProjections = unknown,
> implements IReadDataSource<TDto> {
  constructor(
    private readonly _dbClient: IDbClient<TQueryConditions, TQueryProjections>,
    private readonly _filter: IFilterBuilder<TQueryConditions, TQueryProjections>,
    private readonly _tableName: string,
  ) {}

  public async find(criteria: ReadCriteria, signal: Optional<AbortSignal>): Promise<TDto[]> {
    const filter = this._filter.buildFindCriteria(criteria)
    const projection = this._filter.buildProjections(criteria.cols)
    return await this._dbClient.select<TDto>(this._tableName, filter, projection, signal)
  }

  public async findById(
    id: string,
    criteria: ReadCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<TDto>> {
    const filter = this._filter.buildQueryCriteria(criteria, { id })
    const projection = this._filter.buildProjections(criteria.cols)
    return await this._dbClient.selectOne<TDto>(this._tableName, filter, projection, signal)
  }
}
