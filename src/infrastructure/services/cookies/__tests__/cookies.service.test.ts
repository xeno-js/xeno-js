import type { IConfigurationService, INetworkContextAccessor } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CookieHandlerOptions, ISsrCookieToSet } from '@/domain'

import { CookieHandler } from '../cookies.service'

function makeConfig(nodeEnv = 'development'): IConfigurationService {
  return {
    get: vi.fn((key: string) => (key === 'NODE_ENV' ? nodeEnv : undefined)),
  } as unknown as IConfigurationService
}

function makeRequestHeaders(cookieHeader?: string) {
  return {
    get: vi.fn((name: string) => (name === 'cookie' ? (cookieHeader ?? null) : undefined)),
  }
}

function makeContextAccessor(cookieHeader?: string, responseCookies: string[] = []) {
  const req = { headers: makeRequestHeaders(cookieHeader) }
  const res = {
    headers: {
      getSetCookie: vi.fn(() => [...responseCookies]),
      delete: vi.fn(),
      append: vi.fn(),
    },
  }

  const accessor: INetworkContextAccessor = {
    getNetworkContext: vi.fn(() => ({
      requestId: 'req-123' as never,
      clientIp: '127.0.0.1',
      transport: { req, res },
    })),
  } as unknown as INetworkContextAccessor

  return { accessor, res }
}

describe('CookieHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns an empty list when there is no request or cookie header', () => {
    const config = makeConfig()

    expect(
      new CookieHandler(
        {
          getNetworkContext: vi.fn(() => undefined),
        },
        config,
        { httpOnly: true, path: '/' },
      ).getAll(),
    ).toEqual([])

    const withEmptyCookie = new CookieHandler(
      {
        getNetworkContext: vi.fn(() => ({
          transport: {
            req: { headers: makeRequestHeaders('') },
          },
        })),
      } as unknown as INetworkContextAccessor,
      config,
      { httpOnly: true, path: '/' },
    )

    expect(withEmptyCookie.getAll()).toEqual([])
  })

  it('reads all cookies from the request header and preserves values with equals signs', () => {
    const config = makeConfig()
    const { accessor } = makeContextAccessor('session=abc123; theme=dark; auth=jwt=token')
    const handler = new CookieHandler(accessor, config, { httpOnly: true, path: '/' })

    expect(handler.getAll()).toEqual([
      { name: 'session', value: 'abc123' },
      { name: 'theme', value: 'dark' },
      { name: 'auth', value: 'jwt=token' },
    ])
  })

  it('returns early when the response is missing and serializes cookies otherwise', () => {
    const config = makeConfig()
    const appendSpy = vi.fn()
    const deleteSpy = vi.fn()
    const existingSetCookie = vi.fn(() => ['legacy=1; Path=/'])

    const withoutResponse = new CookieHandler(
      {
        getNetworkContext: vi.fn(() => ({
          transport: { req: { headers: makeRequestHeaders('token=abc') } },
        })),
      } as unknown as INetworkContextAccessor,
      config,
      { httpOnly: true, path: '/' },
    )

    withoutResponse.setAll([{ name: 'session', value: 'abc123' }])
    expect(appendSpy).not.toHaveBeenCalled()

    const withResponse = new CookieHandler(
      {
        getNetworkContext: vi.fn(() => ({
          requestId: 'r-1' as never,
          transport: {
            req: { headers: makeRequestHeaders('token=abc') },
            res: {
              headers: { getSetCookie: existingSetCookie, delete: deleteSpy, append: appendSpy },
            },
          },
        })),
      } as unknown as INetworkContextAccessor,
      config,
      { httpOnly: true, path: '/' },
    )

    withResponse.setAll([{ name: 'session', value: 'abc123' }])

    expect(deleteSpy).toHaveBeenCalledWith('Set-Cookie')
    expect(existingSetCookie).toHaveBeenCalledOnce()
    expect(appendSpy).toHaveBeenCalledTimes(2)
  })

  it('serializes cookies with production defaults and preserves existing Set-Cookie values', () => {
    const config = makeConfig('production')
    const options: CookieHandlerOptions = { path: '/app', httpOnly: true, secure: false }
    const { accessor, res } = makeContextAccessor('token=abc', ['legacy=old; Path=/'])
    const handler = new CookieHandler(accessor, config, options)

    const cookies: ISsrCookieToSet[] = [
      {
        name: 'token',
        value: 'abc+123',
        options: { domain: 'example.com', maxAge: 3600, sameSite: 'strict' },
      },
      {
        name: 'theme',
        value: 'dark',
      },
    ]

    handler.setAll(cookies)

    expect(res.headers.delete).toHaveBeenCalledWith('Set-Cookie')
    expect(res.headers.append).toHaveBeenCalledTimes(3)

    const appendCalls = (res.headers.append as ReturnType<typeof vi.fn>).mock.calls as [
      string,
      string,
    ][]
    const serializedToken = appendCalls[1][1]
    expect(serializedToken).toContain('token=abc%2B123')
    expect(serializedToken).toContain('Path=/app')
    expect(serializedToken).toContain('Max-Age=3600')
    expect(serializedToken).toContain('Domain=example.com')
    expect(serializedToken).toContain('SameSite=strict')
    expect(serializedToken).toContain('HttpOnly')
    expect(serializedToken).not.toContain('Secure')

    const secondHandler = new CookieHandler(accessor, config, {
      path: '/app',
      httpOnly: false,
      secure: true,
    })
    secondHandler.setAll([
      {
        name: 'flag',
        value: 'off',
        options: { sameSite: undefined, maxAge: undefined, domain: undefined },
      },
    ])

    const serializedFlag = (res.headers.append as ReturnType<typeof vi.fn>).mock.calls.at(
      -1,
    )?.[1] as string
    expect(serializedFlag).toContain('flag=off')
    expect(serializedFlag).toContain('Secure')
    expect(serializedFlag).not.toContain('HttpOnly')
    expect(serializedFlag).not.toContain('SameSite')
  })
})
