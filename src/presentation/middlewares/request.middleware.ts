import type {
  ExecutionContext,
  Identity,
  IHttpHeaderExtractor,
  IMiddleware,
  IRequestContext,
  IStrategy,
  NetworkContext,
  TracingContext,
} from '@/domain'
import type { HttpHeaders, Optional } from '@/shared'
import { GUEST, GuidHelper } from '@/shared'

/**
 * @description The RequestContextMiddleware class is responsible for extracting metadata from incoming HTTP requests, performing authentication using the provided authentication middleware, and composing an ExecutionContext that includes identity, network, and tracing information. It implements the IMiddleware interface, allowing it to be used as part of a middleware chain in the request processing pipeline. The middleware ensures that the ExecutionContext is properly set up for downstream handlers, controllers, or use cases to access necessary contextual information for processing the request.
 */
export class RequestContextMiddleware implements IMiddleware<HttpHeaders> {
  constructor(
    private readonly _requestContext: IRequestContext<ExecutionContext>,
    private readonly _extractor: IHttpHeaderExtractor,
    private readonly _authMiddleware: IStrategy<Optional<string>, Identity>,
  ) {}

  public async execute<T>(headers: HttpHeaders, next: () => Promise<T>): Promise<T> {
    const meta = this._extractor.extract(headers)
    const authResult = await this._authMiddleware.execute(meta.token)
    if (!authResult.isOk()) {
      const error = authResult.getErrorOrThrow()
      throw error
    }

    // 3. Composizione dell'ExecutionContext strutturato
    const network: NetworkContext = {
      requestId: meta.requestId ?? GuidHelper.generate(),
      clientIp: meta.clientIp,
    }
    const tracing: TracingContext = {
      correlationId: meta.correlationId ?? GuidHelper.generate(),
      startTime: Date.now(),
      spanId: meta.spanId,
    }
    const identity = authResult.getValueOrThrow()

    const executionContext: ExecutionContext = {
      identity: identity ?? (GUEST as unknown as Identity),
      network,
      tracing,
    }

    // 4. Avvio dell'AsyncLocalStorage per i middleware successivi, controller o use cases
    return this._requestContext.runAsync(executionContext, async () => {
      return next() // Passa al prossimo anello della catena
    })
  }
}
