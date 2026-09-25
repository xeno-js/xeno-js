---
title: 'SSR Cookie Transport Integration and Supabase SSR Strategy in Xeno.JS'
description:
  'Discover why Xeno Core introduces transport-aware middlewares to support
  Server-Side Rendering (SSR) via Supabase SSR, detailing getAll and setAll
  cookie handling.'
keywords:
  'Xeno.JS, TypeScript framework, Supabase SSR, Server-Side Rendering, Cookie
  Management, Middleware Transport, Architecture Decision Record, ADR'
author: 'Xeno.JS Core Team'
robots: 'index, follow'
---

## ADR: SSR Cookie Transport Integration and Supabase SSR Strategy

In standard server-side Node.js applications, HTTP requests are stateless, and
authentication tokens or session cookies are typically read directly from
standard request headers. However, when moving to **Server-Side Rendering
(SSR)** environments (such as Next.js, Nuxt, or custom SSR rendering pipelines),
authentication tokens and cookies flow dynamically through server-side responses
and requests simultaneously.

Specifically, `@supabase/ssr` requires dynamic access to a cookie handler
capable of reading all cookies (`getAll`) and writing new ones (`setAll`) during
the server-side rendering cycle. Traditional HTTP middlewares only receive
standard cloned headers and lack direct access to the underlying transport
objects (`req` and `res`), making it impossible to correctly synchronize SSR
cookies.

## Decision

1. **Transport-Aware Middleware Signature:** The middleware execution contract
   in Xeno Core (`IMiddleware`) has been designed to explicitly accept a
   `transport` object containing both `req` and `res` references
   (`req: { method, path, transport: { req: TRes, res: TReq } }`).
2. **Supabase SSR Integration via `ssrOpts`:** During application bootstrapping,
   the `addAuth` configuration method accepts an optional `ssrOpts` callback
   property (`opts.ssrOpts`). This allows the developer to wire up a dedicated
   cookie handler that interacts directly with the framework's container and
   transport layer.
3. **Dynamic Cookie Bridge:** Through this mechanism, the
   `SupabaseServerAuthFactory` intercepts incoming cookies from the transport
   layer and correctly forwards updated cookies back to the response stream via
   `getAll` and `setAll` methods.

## Flusso Operativo (Workflow)

1. **Incoming SSR Request:** An HTTP request enters the application carrying
   Supabase session cookies (often fragmented or encoded according to the SSR
   standard).
2. **Transport-Aware Middleware:** The `RequestContextMiddleware` and
   `MiddlewareModule` capture the `transport` object (`req` and `res`) making it
   available in the execution.
3. **Cookie Resolution via Factory:** During the initialization of the
   authentication module (`addAuth`), the `ssrOpts` configuration maps the
   cookie handler to the container IoC.
4. **Synchronization (getAll / setAll):** The Supabase SSR client reads the
   current cookies via `getAll()`, validates the token, and, if necessary,
   writes the updated cookies (e.g., session token refresh) directly to the
   response stream via `setAll()`.

## Consequences

- **Pros:**
- **Full SSR compatibility:** Native and seamless support for advanced
  authentication libraries like `@supabase/ssr`, without global hacks..
- **Clean cookie management:** Flawless bidirectional synchronization between
  server-side request and response.

- **Cons:**
- It requires middleware and factories to remain aware of the underlying
  transport layer.
