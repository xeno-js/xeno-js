import { sql, and, eq, gt, lt, ne, inArray } from 'drizzle-orm'
import { SQL } from 'drizzle-orm'

import type { Dictionary, IFilterBuilder, Optional, WriteCriteria } from '@gear5/core'
import { usersTable, type UserDto } from './schema'

// ─────────────────────────────────────────────────────────────────────────────
// FILTER BUILDER IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────
// This is a simple implementation of the IFilterBuilder interface. It provides methods to build various types of query criteria and projections based on the provided WriteCriteria. The actual logic for building these criteria would depend on the specific requirements of your application and database schema.

/**
 * @description Implementazione custom e fortemente tipizzata di IFilterBuilder per la tabella "users".
 * Invece di usare stringhe grezze, questa classe mappa esplicitamente i campi astratti
 * alle colonne reali di Drizzle ORM (usersTable.nomeColonna), garantendo type-safety.
 */
export class UserFilterBuilder implements IFilterBuilder<SQL | undefined, string[] | undefined> {

    /**
     * Scatenato dal metodo dataSource.find()
     */
    public buildFindCriteria(filter: WriteCriteria): SQL | undefined {
        return this.mapCriteriaToDrizzle(filter)
    }

    /**
     * Scatenato dal metodo dataSource.update()
     */
    public buildUpdateCriteria(filter: WriteCriteria): SQL | undefined {
        return this.mapCriteriaToDrizzle(filter)
    }

    /**
     * Scatenato dal metodo dataSource.findById(id)
     * Qui "filter" è l'oggetto { id: string } passato dalla classe astratta.
     */
    public buildQueryCriteria(filter: { id?: string }, _params?: Dictionary<unknown>): SQL | undefined {
        if (filter && filter.id) {
            // Nota: facciamo il cast a Number perché nel Drizzle schema 'id' è di tipo serial (number)
            return eq(usersTable.id, Number(filter.id))
        }
        return undefined
    }

    /**
     * Scatenato dal metodo dataSource.delete(dto)
     * Riceve l'intero oggetto UserDto che si desidera cancellare.
     */
    public buildDeleteCriteria(dto: UserDto): SQL | undefined {
        if (dto && dto.email) {
            // In questo esempio, eliminiamo l'utente basandoci sulla sua email univoca
            return eq(usersTable.email, dto.email)
        }
        return undefined
    }

    public buildProjections(cols: Optional<string[]>): string[] | undefined {
        return cols
    }

    /**
     * Traduce l'oggetto agnostico WriteCriteria nelle condizioni tipizzate di Drizzle.
     */
    private mapCriteriaToDrizzle(criteria: WriteCriteria): SQL | undefined {
        if (!criteria || !Array.isArray(criteria.where) || criteria.where.length === 0) {
            return undefined
        }

        const sqlConditions = criteria.where.map(condition => {
            // 1. Mappatura esplicita del campo stringa alla VERA colonna Drizzle
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

            // 2. Mappatura dell'operatore agnostico (es. 'eq') ai metodi nativi di Drizzle
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

        // Unisce tutte le condizioni in una singola clausola AND
        return and(...sqlConditions)
    }
}