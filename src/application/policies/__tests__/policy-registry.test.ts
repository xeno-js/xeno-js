import type { AuthPolicy } from '@xeno-js/shared' // O dove hai definito AuthPolicy
import { beforeEach, describe, expect, it } from 'vitest'

import { PolicyRegistry } from '../policy-registry' // Assicurati che il percorso sia corretto

describe('PolicyRegistry', () => {
  let registry: PolicyRegistry

  beforeEach(() => {
    registry = new PolicyRegistry()
  })

  it('should add and retrieve a policy correctly', () => {
    const intent = 'CREATE_USER'
    const policy: AuthPolicy = {
      userId: false,
      tenantId: false,
      roles: ['ADMIN'],
      permissions: ['user:create'],
    }

    registry.addPolicy(intent, policy)
    const retrieved = registry.getPolicy(intent)

    expect(retrieved).toBeDefined()
    expect(retrieved).toEqual(policy)
  })

  it('should be case-insensitive regarding the intent key', () => {
    const intentUpper = 'DELETE_USER'
    const intentLower = 'delete_user'
    const policy: AuthPolicy = {
      userId: false,
      tenantId: false,
      roles: ['ADMIN'],
      permissions: ['user:delete'],
    }

    registry.addPolicy(intentUpper, policy)

    // Recupero con formato diverso
    const retrieved = registry.getPolicy(intentLower)

    expect(retrieved).toBeDefined()
    expect(retrieved).toEqual(policy)
  })

  it('should return undefined when requesting a non-existent policy', () => {
    const retrieved = registry.getPolicy('UNKNOWN_INTENT')
    expect(retrieved).toBeUndefined()
  })

  it('should support method chaining (fluent interface)', () => {
    const policy: AuthPolicy = {
      userId: false,
      tenantId: false,
      roles: ['USER'],
      permissions: ['read'],
    }

    // Verifica che addPolicy restituisca 'this'
    const returnedRegistry = registry.addPolicy('READ_ONLY', policy)

    expect(returnedRegistry).toBeInstanceOf(PolicyRegistry)
    expect(registry.getPolicy('READ_ONLY')).toEqual(policy)
  })

  it('should allow overwriting an existing policy for the same intent', () => {
    const intent = 'UPDATE_PROFILE'
    const policy1: AuthPolicy = {
      userId: false,
      tenantId: false,
      roles: ['USER'],
      permissions: ['update'],
    }
    const policy2: AuthPolicy = {
      userId: false,
      tenantId: false,
      roles: ['ADMIN'],
      permissions: ['update', 'delete'],
    }

    registry.addPolicy(intent, policy1)
    registry.addPolicy(intent, policy2)

    expect(registry.getPolicy(intent)).toEqual(policy2)
  })
})
