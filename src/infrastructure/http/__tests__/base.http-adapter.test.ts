import type { Dictionary, Optional } from '@xeno-js/shared'
import { describe, expect, it } from 'vitest'

import type { XenoWebTransport } from '@/domain'

import { BaseHttpAdapter } from '../base.http-adapter'

type RawHeaders = Dictionary<Optional<string | string[]>>
interface HeaderChange {
  name: string
  value: string
  action: 'set' | 'append' | 'delete'
}

class TestHttpAdapter extends BaseHttpAdapter<unknown, object> {
  public readonly changes: HeaderChange[] = []

  public adapt(_req: unknown, res: object): XenoWebTransport {
    return this.createXenoWebTransport(
      new URL('https://localhost/'),
      'GET',
      new Headers(),
      undefined,
      res,
    )
  }

  public parseUrlForTest(
    rawUrl?: string,
    headers: RawHeaders = {},
    queryParams?: Optional<Dictionary>,
  ): URL {
    return this.parseUrl(rawUrl, headers, queryParams)
  }

  public parseHeadersForTest(headers: RawHeaders): Headers {
    return this.parseHeaders(headers)
  }

  public parseBodyForTest(method: Optional<string>, body: unknown): Optional<RequestInit['body']> {
    return this.parseBody(method, body)
  }

  public createTransportForTest(
    url: URL,
    method = 'GET',
    headers = new Headers(),
    body?: unknown,
    res?: object,
  ): XenoWebTransport {
    return this.createXenoWebTransport(url, method, headers, body, res)
  }

  protected handleHeaderChange(
    _res: object,
    name: string,
    value: string,
    action: 'set' | 'append' | 'delete',
  ): void {
    this.changes.push({ name, value, action })
  }
}

describe('BaseHttpAdapter', () => {
  it('parses a relative URL with default protocol and host and applies query parameters', () => {
    const adapter = new TestHttpAdapter()
    const url = adapter.parseUrlForTest(
      '/items?existing=yes',
      { host: 'example.com' },
      {
        tag: ['one', 'two'],
        page: 3,
        omitted: undefined,
      },
    )

    expect(url.origin).toBe('https://example.com')
    expect(url.pathname).toBe('/items')
    expect(url.searchParams.get('existing')).toBe('yes')
    expect(url.searchParams.getAll('tag')).toEqual(['one', 'two'])
    expect(url.searchParams.get('page')).toBe('3')
    expect(url.searchParams.has('omitted')).toBe(false)
  })

  it('uses forwarded protocol, normalizes quoted host values and supports absolute URLs', () => {
    const adapter = new TestHttpAdapter()
    const url = adapter.parseUrlForTest('/path', {
      'x-forwarded-proto': ['http', 'https'],
      'host': '"proxy.example"',
    })

    expect(url.href).toBe('http://proxy.example/path')
  })

  it('uses localhost when host is absent and skips empty query parameters', () => {
    const adapter = new TestHttpAdapter()
    const url = adapter.parseUrlForTest('/', {}, {})

    expect(url.href).toBe('https://localhost/')
  })

  it('parses scalar and array header values while skipping nullish values', () => {
    const adapter = new TestHttpAdapter()
    const headers = adapter.parseHeadersForTest({
      'accept': 'application/json',
      'x-list': ['one', 'two'],
      'x-null': undefined,
    })

    expect(headers.get('accept')).toBe('application/json')
    expect(headers.get('x-list')).toBe('one, two')
    expect(headers.has('x-null')).toBe(false)
  })

  it('returns undefined when method or body is missing or the method does not allow a body', () => {
    const adapter = new TestHttpAdapter()

    expect(adapter.parseBodyForTest(undefined, { data: true })).toBeUndefined()
    expect(adapter.parseBodyForTest('GET', { data: true })).toBeUndefined()
    expect(adapter.parseBodyForTest('POST', undefined)).toBeUndefined()
  })

  it('serializes object bodies as JSON and stringifies primitive bodies', () => {
    const adapter = new TestHttpAdapter()

    expect(adapter.parseBodyForTest('POST', { data: true })).toBe('{"data":true}')
    expect(adapter.parseBodyForTest('DELETE', 42)).toBe('42')
    expect(adapter.parseBodyForTest('POST', false)).toBe('false')
  })

  it('serializes object-like body types through the object branch', () => {
    const adapter = new TestHttpAdapter()
    const blob = new Blob(['payload'])
    const buffer = new ArrayBuffer(2)
    const view = new Uint8Array([1, 2])
    const params = new URLSearchParams('a=1')
    const form = new FormData()

    expect(adapter.parseBodyForTest('PUT', blob)).toBe('{}')
    expect(adapter.parseBodyForTest('PATCH', buffer)).toBe('{}')
    expect(adapter.parseBodyForTest('POST', view)).toBe('{"0":1,"1":2}')
    expect(adapter.parseBodyForTest('POST', params)).toBe('{}')
    expect(adapter.parseBodyForTest('POST', form)).toBe('{}')
  })

  it('creates a transport, sets the request path and leaves body unset for safe methods', () => {
    const adapter = new TestHttpAdapter()
    const transport = adapter.createTransportForTest(
      new URL('https://example.com/users?q=1'),
      'get',
    )

    expect(transport.request.method).toBe('GET')
    expect(transport.request.path).toBe('/users')
    expect(transport.request.body).toBeNull()
    expect(transport.response).toBeInstanceOf(Response)
  })

  it('serializes request bodies and forwards response header mutations to the adapter', async () => {
    const adapter = new TestHttpAdapter()
    const transport = adapter.createTransportForTest(
      new URL('https://example.com/items'),
      'post',
      new Headers(),
      { id: 1 },
      {},
    )

    expect(transport.request.method).toBe('POST')
    expect(transport.request.headers.get('content-type')).toBe('text/plain;charset=UTF-8')
    await expect(transport.request.text()).resolves.toBe('{"id":1}')

    transport.response.headers.append('set-cookie', 'a=1')
    transport.response.headers.set('x-result', 'ok')
    transport.response.headers.delete('x-result')

    expect(adapter.changes).toEqual([
      { name: 'set-cookie', value: 'a=1', action: 'append' },
      { name: 'x-result', value: 'ok', action: 'set' },
      { name: 'x-result', value: '', action: 'delete' },
    ])
  })

  it('creates a transport without response-header forwarding when the response is not supplied', () => {
    const adapter = new TestHttpAdapter()
    const transport = adapter.createTransportForTest(new URL('https://example.com/'))

    transport.response.headers.set('x-result', 'ok')

    expect(adapter.changes).toEqual([])
  })
})
