import { describe, expect, it, vi } from 'vitest'

import type { IHttpClient, IServiceResilience } from '@/domain'
import type { HttpRequest } from '@/shared'

import { RemoteDataSource } from '../remote.datasource'

interface Payload {
  id: string
  name: string
}

function makeRequest<TBody>(method: HttpRequest<TBody>['method'], body: TBody): HttpRequest<TBody> {
  return {
    method,
    url: '/ignored-by-remote-datasource',
    body,
    headers: { authorization: 'Bearer token' },
    query: { page: 1 },
    signal: undefined,
    timeoutMs: 1_000,
  }
}

function makeDeps() {
  const getMock = vi.fn()
  const postMock = vi.fn()
  const putMock = vi.fn()
  const patchMock = vi.fn()
  const deleteMock = vi.fn()

  const executeMock = vi.fn(async (action: () => Promise<unknown>) => await action())

  const httpClient = {
    get: getMock,
    post: postMock,
    put: putMock,
    patch: patchMock,
    delete: deleteMock,
  } as unknown as IHttpClient

  const resilienceService = {
    execute: executeMock,
  } as unknown as IServiceResilience

  return {
    httpClient,
    resilienceService,
    mocks: {
      getMock,
      postMock,
      putMock,
      patchMock,
      deleteMock,
      executeMock,
    },
  }
}

describe('RemoteDataSource', () => {
  it('send with GET calls httpClient.get and returns ok(response.data)', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users'
    const request = makeRequest<undefined>('GET', undefined)
    const data: Payload = { id: '1', name: 'Alice' }

    mocks.getMock.mockResolvedValue({ data })

    const datasource = new RemoteDataSource(httpClient, resilienceService)
    const result = await datasource.send<Payload, undefined>(endpoint, request)

    expect(mocks.executeMock).toHaveBeenCalledWith(expect.any(Function), request.signal)
    expect(mocks.getMock).toHaveBeenCalledWith(endpoint, {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
    })
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('send with POST calls httpClient.post with body and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users'
    const request = makeRequest('POST', { name: 'Alice' })
    const data: Payload = { id: '1', name: 'Alice' }

    mocks.postMock.mockResolvedValue({ data })

    const datasource = new RemoteDataSource(httpClient, resilienceService)
    const result = await datasource.send<Payload, { name: string }>(endpoint, request)

    expect(mocks.postMock).toHaveBeenCalledWith(endpoint, request.body, {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
    })
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('send with PUT calls httpClient.put with body and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users/1'
    const request = makeRequest('PUT', { name: 'Alice Updated' })
    const data: Payload = { id: '1', name: 'Alice Updated' }

    mocks.putMock.mockResolvedValue({ data })

    const datasource = new RemoteDataSource(httpClient, resilienceService)
    const result = await datasource.send<Payload, { name: string }>(endpoint, request)

    expect(mocks.putMock).toHaveBeenCalledWith(endpoint, request.body, {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
    })
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('send with PATCH calls httpClient.patch with body and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users/1'
    const request = makeRequest('PATCH', { name: 'Alice Patched' })
    const data: Payload = { id: '1', name: 'Alice Patched' }

    mocks.patchMock.mockResolvedValue({ data })

    const datasource = new RemoteDataSource(httpClient, resilienceService)
    const result = await datasource.send<Payload, { name: string }>(endpoint, request)

    expect(mocks.patchMock).toHaveBeenCalledWith(endpoint, request.body, {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
    })
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('send with DELETE calls httpClient.delete and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users/1'
    const request = makeRequest<undefined>('DELETE', undefined)
    const data: Payload = { id: '1', name: 'Alice' }

    mocks.deleteMock.mockResolvedValue({ data })

    const datasource = new RemoteDataSource(httpClient, resilienceService)
    const result = await datasource.send<Payload, undefined>(endpoint, request)

    expect(mocks.deleteMock).toHaveBeenCalledWith(endpoint, {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
    })
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('send throws for unsupported method and does not mutate input request', async () => {
    const { httpClient, resilienceService } = makeDeps()
    const endpoint = '/users/1'
    const request = makeRequest<undefined>('HEAD', undefined)
    const originalSnapshot = structuredClone(request)

    const datasource = new RemoteDataSource(httpClient, resilienceService)

    await expect(datasource.send<Payload, undefined>(endpoint, request)).rejects.toThrow(
      'Unsupported HTTP method: HEAD',
    )
    expect(request).toEqual(originalSnapshot)
  })

  it('send propagates errors thrown by resilience service', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users'
    const request = makeRequest<undefined>('GET', undefined)
    const expectedError = new Error('resilience failure')

    mocks.executeMock.mockRejectedValue(expectedError)

    const datasource = new RemoteDataSource(httpClient, resilienceService)

    await expect(datasource.send<Payload, undefined>(endpoint, request)).rejects.toThrow(
      'resilience failure',
    )
  })
})
