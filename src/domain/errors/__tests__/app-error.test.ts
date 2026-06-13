import { describe, expect, it } from 'vitest'

import { AppError } from '../app-error'

describe('AppError', () => {
  it('creates an AppError with the provided message, code, status, name, and cause', () => {
    const error = AppError.create({
      message: 'Something went wrong',
      code: 'ERROR_CODE',
      status: 400,
      name: 'TestError',
      cause: new Error('Underlying error'),
    })

    expect(error).toBeInstanceOf(AppError)
    expect(error.name).toBe('TestError')
    expect(error.message).toBe('Something went wrong')
    expect(error.code).toBe('ERROR_CODE')
    expect(error.status).toBe(400)
    expect(error.cause).toBeInstanceOf(Error)
  })

  it('supports undefined as a valid cause', () => {
    const error = AppError.create({
      message: 'Failed to process request',
      code: 'PROCESSING_ERROR',
      status: 500,
      name: 'TestError',
      cause: undefined,
    })
    expect(error.cause).toBeUndefined()
  })

  it('supports null as a valid cause', () => {
    const error = AppError.create({
      message: 'Failed to process request',
      code: 'PROCESSING_ERROR',
      status: 500,
      name: 'TestError',
      cause: null,
    })
    expect(error.cause).toBeNull()
  })

  it('throws an AppError when using the throw method', () => {
    expect(() =>
      AppError.throw({
        message: 'Unauthorized access',
        code: 'UNAUTHORIZED',
        status: 401,
        name: 'TestError',
        cause: new Error('Invalid credentials'),
      }),
    ).toThrowError(AppError)
  })

  it('creates an aborted AppError with the correct properties', () => {
    const error = AppError.aborted('TestContext')
    expect(error).toBeInstanceOf(AppError)
    expect(error.name).toBe('TestContext')
    expect(error.message).toBe('errors.aborted')
    expect(error.code).toBe('ABORTED')
    expect(error.status).toBe(499)
    expect(error.cause).toBeInstanceOf(Error)
    expect(error.cause).toEqual(
      new Error('The client closed the connection before the server finished responding.'),
    )
  })

  it('throws an AppError when signal is aborted', () => {
    const abortController = new AbortController()
    abortController.abort()
    expect(() => AppError.throwIfAborted(abortController.signal, 'TestContext')).toThrowError(
      AppError,
    )
  })

  it('does not throw when signal is not aborted', () => {
    const abortController = new AbortController()
    expect(() => AppError.throwIfAborted(abortController.signal, 'TestContext')).not.toThrow()
  })

  it('does not throw when signal is undefined', () => {
    expect(() => AppError.throwIfAborted(undefined, 'TestContext')).not.toThrow()
  })

  it('does not throw when signal is null', () => {
    expect(() => AppError.throwIfAborted(null, 'TestContext')).not.toThrow()
  })

  it('is an instance of the built-in Error class', () => {
    const error = AppError.create({
      message: 'An error occurred',
      code: 'ERROR_CODE',
      status: 500,
      name: 'TestError',
      cause: new Error('Underlying error'),
    })
    expect(error).toBeInstanceOf(Error)
  })

  it('has a stack trace', () => {
    const error = AppError.create({
      message: 'An error occurred',
      code: 'ERROR_CODE',
      status: 500,
      name: 'TestError',
      cause: new Error('Underlying error'),
    })
    expect(error.stack).toBeDefined()
  })
})
