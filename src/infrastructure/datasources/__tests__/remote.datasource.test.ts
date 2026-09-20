import type { IHttpClient, IServiceResilience } from '@xeno-js/shared'
import type { HttpRequest } from '@xeno-js/shared'
import { describe, expect, it, vi } from 'vitest'

import { RemoteDataSource } from '../remote.datasource'

interface Payload {
  id: string
  name: string
}

class MyRemoteDataSource extends RemoteDataSource {}

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
  it('get calls httpClient.get and returns ok(response.data)', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users'
    const request = makeRequest<undefined>('GET', undefined)
    const data: Payload = { id: '1', name: 'Alice' }

    mocks.getMock.mockResolvedValue({ data })

    const datasource = new MyRemoteDataSource(httpClient, resilienceService)
    const baseReq = {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
    }
    const result = await datasource.get<Payload>(endpoint, baseReq)

    expect(mocks.executeMock).toHaveBeenCalledWith(expect.any(Function), request.signal)
    expect(mocks.getMock).toHaveBeenCalledWith(endpoint, { ...baseReq, method: 'GET' })
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('post calls httpClient.post with body and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users'
    const request = makeRequest('POST', { name: 'Alice' })
    const data: Payload = { id: '1', name: 'Alice' }

    mocks.postMock.mockResolvedValue({ data })

    const datasource = new MyRemoteDataSource(httpClient, resilienceService)
    const result = await datasource.post<Payload, { name: string }>(
      endpoint,
      { name: 'Alice' },
      {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
      },
    )

    expect(mocks.postMock).toHaveBeenCalledWith(
      endpoint,
      { name: 'Alice' },
      {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
        body: { name: 'Alice' },
        method: 'POST',
      },
    )
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('put calls httpClient.put with body and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users/1'
    const request = makeRequest('PUT', { name: 'Alice Updated' })
    const data: Payload = { id: '1', name: 'Alice Updated' }

    mocks.putMock.mockResolvedValue({ data })

    const datasource = new MyRemoteDataSource(httpClient, resilienceService)
    const result = await datasource.put<Payload, { name: string }>(
      endpoint,
      { name: 'Alice Updated' },
      {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
      },
    )

    expect(mocks.putMock).toHaveBeenCalledWith(
      endpoint,
      { name: 'Alice Updated' },
      {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
        method: 'PUT',
        body: { name: 'Alice Updated' },
      },
    )
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('patch calls httpClient.patch with body and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users/1'
    const request = makeRequest('PATCH', { name: 'Alice Patched' })
    const data: Payload = { id: '1', name: 'Alice Patched' }

    mocks.patchMock.mockResolvedValue({ data })

    const datasource = new MyRemoteDataSource(httpClient, resilienceService)
    const result = await datasource.patch<Payload, { name: string }>(
      endpoint,
      { name: 'Alice Patched' },
      {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
      },
    )

    expect(mocks.patchMock).toHaveBeenCalledWith(
      endpoint,
      { name: 'Alice Patched' },
      {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
        method: 'PATCH',
        body: { name: 'Alice Patched' },
      },
    )
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('delete calls httpClient.delete and returns data', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users/1'
    const request = makeRequest<undefined>('DELETE', undefined)
    const data: Payload = { id: '1', name: 'Alice' }

    mocks.deleteMock.mockResolvedValue({ data })

    const datasource = new MyRemoteDataSource(httpClient, resilienceService)
    const result = await datasource.delete<Payload>(endpoint, {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
    })

    expect(mocks.deleteMock).toHaveBeenCalledWith(endpoint, {
      query: request.query,
      signal: request.signal,
      timeoutMs: request.timeoutMs,
      headers: request.headers,
      method: 'DELETE',
    })
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toEqual(data)
  })

  it('get propagates errors thrown by resilience service', async () => {
    const { httpClient, resilienceService, mocks } = makeDeps()
    const endpoint = '/users'
    const request = makeRequest<undefined>('GET', undefined)
    const expectedError = new Error('resilience failure')

    mocks.executeMock.mockRejectedValue(expectedError)

    const datasource = new MyRemoteDataSource(httpClient, resilienceService)

    await expect(
      datasource.get<Payload>(endpoint, {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
      }),
    ).rejects.toThrow('resilience failure')
  })
})
