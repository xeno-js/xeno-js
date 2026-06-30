import { sql, and, eq, gt, lt, ne, inArray } from 'drizzle-orm'
import { SQL } from 'drizzle-orm'

import type { Dictionary, IFilterBuilder, Optional, WriteCriteria } from '@gantry5/core'
import { usersTable, type UserDto } from './schema'

// ─────────────────────────────────────────────────────────────────────────────
// FILTER BUILDER IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────
// This is a simple implementation of the IFilterBuilder interface. It provides methods to build various types of query criteria and projections based on the provided WriteCriteria. The actual logic for building these criteria would depend on the specific requirements of your application and database schema.

/**
 * @description The UserFilterBuilder class is an implementation of the IFilterBuilder interface, specifically designed for building query criteria and projections for the "users" table in a Drizzle ORM context. It translates agnostic WriteCriteria into Drizzle-specific SQL conditions, allowing for flexible querying based on various filter conditions. The class includes methods for building find, update, query, and delete criteria, as well as handling projections for selected columns. 
 */
export class UserFilterBuilder implements IFilterBuilder<SQL | undefined, string[] | undefined> {

    public buildFindCriteria(filter: WriteCriteria): SQL | undefined {
        return this.mapCriteriaToDrizzle(filter)
    }

    public buildUpdateCriteria(filter: WriteCriteria): SQL | undefined {
        return this.mapCriteriaToDrizzle(filter)
    }

    public buildQueryCriteria(filter: { id?: string }, _params?: Dictionary<unknown>): SQL | undefined {
        if (filter && filter.id) {
            return eq(usersTable.id, Number(filter.id))
        }
        return undefined
    }

    public buildDeleteCriteria(dto: UserDto): SQL | undefined {
        if (dto && dto.email) {
            return eq(usersTable.email, dto.email)
        }
        return undefined
    }

    public buildProjections(cols: Optional<string[]>): string[] | undefined {
        return cols
    }

    /**
     * @description The mapCriteriaToDrizzle method is a private utility function that translates agnostic WriteCriteria into Drizzle-specific SQL conditions. It maps the provided filter conditions to the corresponding Drizzle ORM column references and operators, allowing for flexible querying based on various filter conditions. This method handles different operators such as 'eq', 'neq', 'gt', 'lt', and 'in', and constructs a combined SQL condition using the AND operator.
     * @param criteria The WriteCriteria object containing the filter conditions to be translated.
     * @returns A Drizzle-specific SQL condition that can be used in queries, or undefined if no valid conditions are provided.
     */
    private mapCriteriaToDrizzle(criteria: WriteCriteria): SQL | undefined {
        if (!criteria || !Array.isArray(criteria.where) || criteria.where.length === 0) {
            return undefined
        }

        const sqlConditions = criteria.where.map(condition => {
            let column
            switch (condition.field) {
                case 'id': column = usersTable.id; break
                case 'name': column = usersTable.name; break
                case 'email': column = usersTable.email; break
                case 'createdAt': column = usersTable.createdAt; break
                default:
                    throw new Error(`[UserFilterBuilder] Field not recognized or not filterable: ${condition.field}`)
            }

            const val = condition.value as any

            switch (condition.operator) {
                case 'eq': return eq(column, val)
                case 'neq': return ne(column, val)
                case 'gt': return gt(column, val)
                case 'lt': return lt(column, val)
                case 'in':
                    const arrayVals = Array.isArray(val) ? val : [val]
                    if (arrayVals.length === 0) return eq(sql`1`, 0) // Fallback query sempre falsa
                    return inArray(column, arrayVals)
                default:
                    return eq(column, val)
            }
        })

        return and(...sqlConditions)
    }
}