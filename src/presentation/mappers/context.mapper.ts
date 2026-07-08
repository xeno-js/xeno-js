import type {
  ExecutionContext,
  IBaseMapper,
  Identity,
  IServiceScope,
  MessagingContext,
  NetworkContext,
  TracingContext,
} from '@/domain'
import { Guards, type Metadata, type Optional } from '@/shared'

interface ContextMapperSource {
  readonly metadata: Metadata
  readonly identity: Identity
  readonly scope: IServiceScope
  readonly path: string
  readonly isPublic: boolean
}

export const ContextMapper: IBaseMapper<ContextMapperSource, ExecutionContext> = Object.freeze({
  /**
   * @description Maps to ExecutionContext. It extracts relevant information from the object, such as correlation ID, request ID, authentication token, client IP, user agent, format indicator, and messaging context (if available). The method constructs an ExecutionContext object that encapsulates all this information, providing a structured representation of the request context for further processing in the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  map: (source: ContextMapperSource): ExecutionContext => {
    const { metadata, identity, path, scope, isPublic } = source

    const network: NetworkContext = {
      requestId: metadata.requestId!,
      clientIp: metadata.clientIp,
      userAgent: metadata.userAgent,
      formatIndicator: metadata.formatIndicator,
      path,
      isPublic,
    }
    const tracing: TracingContext = {
      correlationId: metadata.correlationId!,
      startTime: Date.now(),
      spanId: metadata.spanId,
      parentSpanId: metadata.parentSpanId,
    }
    const messaging = _buildMessagingContext(metadata)

    const executionContext: ExecutionContext = {
      context: {
        identity,
        network,
        tracing,
        messaging,
      },
      scope,
    }

    return executionContext
  },
} as const)

/**
 * @description Builds the MessagingContext based on the provided Metadata. It checks for the presence of sequence data, expiration, and return address in the metadata to determine if a MessagingContext should be created. If any of these properties are defined, it constructs a MessagingContext object with the relevant information; otherwise, it returns undefined. This method encapsulates the logic for determining whether messaging-related context is available and ensures that the resulting MessagingContext is properly structured.
 * @param meta The Metadata object extracted from the HTTP request headers, containing information such as correlation ID, request ID, authentication token, client IP, user agent, format indicator, return address, expiration, and sequence data. This metadata is used to determine whether a MessagingContext should be created and what properties it should contain.
 * @returns An Optional<MessagingContext> object that contains messaging-related context information if available; otherwise, it returns undefined. The MessagingContext includes properties such as return address, expiration time, and sequence information (sequence ID, position, and size) if they are present in the metadata.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
function _buildMessagingContext(meta: Metadata): Optional<MessagingContext> {
  const hasSequenceData =
    Guards.isDefined(meta.sequence?.sequenceId) ||
    Guards.isDefined(meta.sequence?.position) ||
    Guards.isDefined(meta.sequence?.size)

  const hasMessagingData =
    hasSequenceData || Guards.isDefined(meta.expiration) || Guards.isDefined(meta.returnAddress)

  const messaging: Optional<MessagingContext> = hasMessagingData
    ? {
        returnAddress: meta.returnAddress,
        expiration: meta.expiration,
        sequence: hasSequenceData ? meta.sequence : undefined,
      }
    : undefined
  return messaging
}
