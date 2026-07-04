import { beforeEach, describe, expect, it } from 'vitest'

import { TokenHelper } from '@/shared'

import { ServiceContainer } from '../service-container'

// ─── Helpers ──────────────────────────────────────────────────────────────────

class Dep {}
class ServiceA {
  constructor(public dep: Dep) {}
}
class ServiceB {}
class ServiceC {}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ServiceContainer', () => {
  let container: ServiceContainer

  beforeEach(() => {
    container = new ServiceContainer()
  })

  // ── constructor ─────────────────────────────────────────────────────────────

  it('registers itself as a singleton under SERVICE_CONTAINER token on construction', () => {
    const token = TokenHelper.get<ServiceContainer>('SERVICE_CONTAINER')
    expect(token).toBeDefined()
    const resolved = container.resolve(token!)
    expect(resolved).toBe(container)
  })

  // ── addSingleton ────────────────────────────────────────────────────────────

  describe('addSingleton', () => {
    it('registers and resolves a singleton', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-singleton')
      container.addSingleton(token, ServiceB)
      const instance = container.resolve(token)
      expect(instance).toBeInstanceOf(ServiceB)
    })

    it('returns the same instance on repeated resolves', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-singleton-same')
      container.addSingleton(token, ServiceB)
      const a = container.resolve(token)
      const b = container.resolve(token)
      expect(a).toBe(b)
    })

    it('resolves dependencies', () => {
      const depToken = TokenHelper.createToken<Dep>('Dep-singleton-dep')
      const svcToken = TokenHelper.createToken<ServiceA>('ServiceA-singleton-dep')
      container.addSingleton(depToken, Dep)
      container.addSingleton(svcToken, ServiceA, [depToken] as const)
      const instance = container.resolve(svcToken)
      expect(instance).toBeInstanceOf(ServiceA)
      expect(instance.dep).toBeInstanceOf(Dep)
    })

    it('returns this for chaining', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-chain-singleton')
      expect(container.addSingleton(token, ServiceB)).toBe(container)
    })
  })

  // ── addTransient ────────────────────────────────────────────────────────────

  describe('addTransient', () => {
    it('registers and resolves a transient', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-transient')
      container.addTransient(token, ServiceB)
      const instance = container.resolve(token)
      expect(instance).toBeInstanceOf(ServiceB)
    })

    it('returns a new instance on each resolve', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-transient-new')
      container.addTransient(token, ServiceB)
      const a = container.resolve(token)
      const b = container.resolve(token)
      expect(a).not.toBe(b)
    })

    it('resolves dependencies', () => {
      const depToken = TokenHelper.createToken<Dep>('Dep-transient-dep')
      const svcToken = TokenHelper.createToken<ServiceA>('ServiceA-transient-dep')
      container.addTransient(depToken, Dep)
      container.addTransient(svcToken, ServiceA, [depToken] as const)
      const instance = container.resolve(svcToken)
      expect(instance).toBeInstanceOf(ServiceA)
      expect(instance.dep).toBeInstanceOf(Dep)
    })

    it('returns this for chaining', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-chain-transient')
      expect(container.addTransient(token, ServiceB)).toBe(container)
    })
  })

  // ── addScoped ───────────────────────────────────────────────────────────────

  describe('addScoped', () => {
    it('throws when resolving scoped directly from container', () => {
      const token = TokenHelper.createToken<ServiceC>('ServiceC-scoped-direct')
      container.addScoped(token, ServiceC)
      expect(() => container.resolve(token)).toThrow(
        'Scoped services must be resolved through a scope',
      )
    })

    it('returns this for chaining', () => {
      const token = TokenHelper.createToken<ServiceC>('ServiceC-chain-scoped')
      expect(container.addScoped(token, ServiceC)).toBe(container)
    })
  })

  // ── addSingletonFactory ─────────────────────────────────────────────────────

  describe('addSingletonFactory', () => {
    it('registers and resolves via factory', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-singleton-factory')
      container.addSingletonFactory(token, () => new ServiceB())
      const instance = container.resolve(token)
      expect(instance).toBeInstanceOf(ServiceB)
    })

    it('returns same instance on repeated resolves', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-singleton-factory-same')
      container.addSingletonFactory(token, () => new ServiceB())
      const a = container.resolve(token)
      const b = container.resolve(token)
      expect(a).toBe(b)
    })

    it('passes container to factory', () => {
      const token = TokenHelper.createToken<ServiceContainer>('ServiceB-singleton-factory-ctx')
      let received: unknown
      container.addSingletonFactory(token, (c) => {
        received = c
        return new ServiceB() as unknown as ServiceContainer
      })
      container.resolve(token)
      expect(received).toBe(container)
    })

    it('returns this for chaining', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-chain-singleton-factory')
      expect(container.addSingletonFactory(token, () => new ServiceB())).toBe(container)
    })
  })

  // ── addScopedFactory ────────────────────────────────────────────────────────

  describe('addScopedFactory', () => {
    it('resolves scoped factory via scope', () => {
      const token = TokenHelper.createToken<ServiceC>('ServiceC-scoped-factory')
      container.addScopedFactory(token, () => new ServiceC())
      const scope = container.createScope()
      const instance = scope.resolve(token)
      expect(instance).toBeInstanceOf(ServiceC)
      scope.dispose()
    })

    it('returns this for chaining', () => {
      const token = TokenHelper.createToken<ServiceC>('ServiceC-chain-scoped-factory')
      expect(container.addScopedFactory(token, () => new ServiceC())).toBe(container)
    })
  })

  // ── addTransientFactory ─────────────────────────────────────────────────────

  describe('addTransientFactory', () => {
    it('registers and resolves via factory', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-transient-factory')
      container.addTransientFactory(token, () => new ServiceB())
      const instance = container.resolve(token)
      expect(instance).toBeInstanceOf(ServiceB)
    })

    it('returns a new instance on each resolve', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-transient-factory-new')
      container.addTransientFactory(token, () => new ServiceB())
      const a = container.resolve(token)
      const b = container.resolve(token)
      expect(a).not.toBe(b)
    })

    it('returns this for chaining', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-chain-transient-factory')
      expect(container.addTransientFactory(token, () => new ServiceB())).toBe(container)
    })
  })

  // ── resolve ─────────────────────────────────────────────────────────────────

  describe('resolve', () => {
    it('throws when no registration found', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-unregistered-resolve')
      expect(() => container.resolve(token)).toThrow('No registration found for token')
    })
  })

  // ── createScope ─────────────────────────────────────────────────────────────

  describe('createScope', () => {
    it('creates a scope that resolves scoped services', () => {
      const token = TokenHelper.createToken<ServiceC>('ServiceC-createscope')
      container.addScoped(token, ServiceC)
      const scope = container.createScope()
      const instance = scope.resolve(token)
      expect(instance).toBeInstanceOf(ServiceC)
      scope.dispose()
    })

    it('scope returns same instance within the same scope', () => {
      const token = TokenHelper.createToken<ServiceC>('ServiceC-createscope-same')
      container.addScoped(token, ServiceC)
      const scope = container.createScope()
      const a = scope.resolve(token)
      const b = scope.resolve(token)
      expect(a).toBe(b)
      scope.dispose()
    })

    it('scope delegates non-scoped to root container', () => {
      const token = TokenHelper.createToken<ServiceB>('ServiceB-scope-delegates')
      container.addSingleton(token, ServiceB)
      const scope = container.createScope()
      const instance = scope.resolve(token)
      expect(instance).toBeInstanceOf(ServiceB)
      scope.dispose()
    })
  })
})
