# CQRS Implementation Guide - Gantry5 Framework

This project demonstrates the implementation of the **CQRS (Command Query
Responsibility Segregation)** pattern using the `gantry5` framework. The
architecture focuses on decoupling write operations (Commands) from read
operations (Queries), ensuring a clean, maintainable, and scalable codebase.

## 🏗️ Architectural Overview

The system follows a strict flow to handle requests:

1. **Entry Point (`index.ts`)**: Fastify handles HTTP requests and invokes the
   application middleware.
2. **Controller (`controller.ts`)**: Acts as a bridge, transforming HTTP inputs
   into domain-agnostic `Commands` or `Queries`.
3. **Mediator**: The engine that routes requests to the appropriate handlers and
   executes pipeline behaviors (middlewares).
4. **Handlers**: Contain the actual business logic to process the request.
5. **Dependency Injection**: Managed by `AppBuilder`, using `tokens.ts` for
   clean service resolution.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v20+)
- `gantry5` framework (linked via file path in `package.json`)

### 2. Implementation Steps

#### A. Define the Request (`command.ts` / `query.ts`)

Create a class implementing `ICommand` or `IQuery`. Each class **must** define a
unique `intent` string.

```typescript
export class PingCommand implements ICommand<{ echoed: string }> {
  public readonly intent = 'PingCommand' // Unique identifier
  public readonly type = REQUEST_TYPE.COMMAND
  constructor(
    public readonly message: string,
    public readonly signal: AbortSignal,
  ) {}
}
```

#### B. Create the Handler (`command.handler.ts`)

Implement the `IHandler` interface. The `handle` method contains your business
logic.

```typescript
export class PingCommandHandler implements IHandler<
  PingCommand,
  { echoed: string }
> {
  public async handle(request: PingCommand) {
    return Result.ok({ echoed: request.message })
  }
}
```

#### C. Register Tokens (`tokens.ts`)

Use `TokenHelper` to create a registration token. **Crucial:** The token
description _must_ match the `intent` defined in your Command/Query class to
ensure the Mediator can resolve the handler correctly.

```typescript
export const PING_HANDLER_TOKEN =
  TokenHelper.createToken<IHandler<PingCommand, any>>('PingCommand')
```

#### D. Bootstrap the Container (`bootstrap.ts`)

Register your handlers and controllers in the `AppBuilder`.

```typescript
builder.addServices((services) => {
  services.addTransient(PING_HANDLER_TOKEN, PingCommandHandler, [])
  // Register controllers with Mediator injection
  services.addTransientFactory(
    PING_CONTROLLER_TOKEN,
    (c) => new PingController(c.resolve(INJECTION_TOKENS.MEDIATOR)),
  )
})
```

#### E. Handle the HTTP Request (`index.ts`)

Use the `middleware` to wrap the request, which automatically manages the
execution context (identity, tracing, etc.).

```typescript
const responseDto = await middleware.execute(
  request.headers as any,
  async () => {
    return await pingController.handle(payload)
  },
)
```

## 🛠️ Best Practices

- **Never bypass the Mediator**: Always use the Mediator to send
  commands/queries to maintain the pipeline integrity.
- **Token Consistency**: Always double-check that the `intent` property matches
  the string used in `TokenHelper.createToken`.
- **Async Safety**: Always pass the `AbortSignal` through the layers to ensure
  the application remains responsive and can cancel long-running operations.

## 📂 Project Structure

- `cqrs/`: Contains command/query definitions and their respective handlers.
- `controllers/`: Handles incoming HTTP traffic and Mediator calls.
- `bootstrap.ts`: Dependency injection configuration.
- `tokens.ts`: Centralized registry of DI tokens.
