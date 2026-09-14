import { Guards, type HttpMethod } from '@xeno-js/shared'

import type { IAllowMethod } from '@/domain'

interface DynamicRoute {
  pattern: RegExp
  methods: HttpMethod[]
}

export class AllowMethodRegistry implements IAllowMethod {
  private readonly _staticRoutes = new Map<string, HttpMethod[]>()
  private readonly _dynamicRoutes: DynamicRoute[] = []

  public add(path: string, methods: HttpMethod[]): void {
    const normalizedPath = this.normalizePath(path)

    if (this.isDynamicPath(normalizedPath)) {
      const pattern = this.createRoutePattern(normalizedPath)
      this._dynamicRoutes.push({ pattern, methods })
    } else {
      this._staticRoutes.set(normalizedPath, methods)
    }
  }

  public check(path: string, method: HttpMethod): boolean {
    const cleanPath = this.normalizePath(path.split('?')[0].split('#')[0])

    const staticMethods = this._staticRoutes.get(cleanPath)
    if (Guards.isDefined(staticMethods)) return staticMethods.includes(method)

    for (const route of this._dynamicRoutes) {
      if (route.pattern.test(cleanPath)) return route.methods.includes(method)
    }

    return false
  }

  private isDynamicPath(path: string): boolean {
    return path.includes(':') || (path.includes('{') && path.includes('}'))
  }

  private normalizePath(path: string): string {
    const trimmed = path.trim()
    const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    if (withLeadingSlash === '/') return '/'
    return withLeadingSlash.replace(/\/+$/, '')
  }

  private createRoutePattern(path: string): RegExp {
    const segments = path.split('/').filter(Boolean)

    const regexSegments = segments.map((segment) => {
      if (segment.startsWith(':') || (segment.startsWith('{') && segment.endsWith('}')))
        return '([^/]+)'
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    })

    return new RegExp(`^\\/${regexSegments.join('\\/')}\\/?$`)
  }
}
