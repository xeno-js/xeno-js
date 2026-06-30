# 🚀 Gantry5 Core Demo: HTTP Integration

Welcome to the **Gantry5 Core** demo. This project demonstrates how to build a
production-ready HTTP infrastructure using the Gantry5 Core framework, focusing
on clean architecture, dependency injection, and resilient service-to-service
communication.

## 🎯 Objective

This demo showcases how Gantry5 Core simplifies external service calls (e.g.,
PokeAPI) through a `RemoteDataSource`. It implements robust resilience patterns
to handle network volatility, ensuring your business logic remains decoupled
from infrastructure concerns.

## 🛠️ Prerequisites

- **Node.js**: v20.0.0 or higher.
- **Package Manager**: npm, yarn, or pnpm.

## 📦 Infrastructure & Dependencies

To replicate this setup, you must integrate the following core packages:

```bash
# Core framework
npm install @gantry5

# Required infrastructure dependencies
npm install axios cockatiel

```

- **Axios**: Acts as the HTTP client engine for the transport layer.
- **Cockatiel**: Provides the resilience patterns (Retry policies and Circuit
  Breakers) applied to data source operations.

## 🚀 Quick Start

### 1. Installation

Install the project dependencies:

```bash
npm install

```

### 2. Execution

Start the demo server in development mode:

```bash
npm start

```

The server will be available at `http://localhost:3000`. Test the implementation
with: `GET http://localhost:3000/pokemon/pikachu`

---

## 🧠 Core Architecture

Gantry5 Core is built on the principles of **Dependency Inversion**. The
infrastructure is assembled via the `AppBuilder` in `bootstrap.ts`.

### Resilience Patterns

We apply resilience policies to the `RemoteDataSource` to ensure system
stability:

- **Retry Policy**: Automatically attempts failed requests a configured number
  of times, mitigating transient network errors.
- **Circuit Breaker**: Monitors consecutive failures. If the threshold is
  exceeded, the "circuit" trips, preventing requests to the failing service and
  allowing it time to recover.

### Configuration

In `bootstrap.ts`, we register these policies within the container:

```typescript
builder.addHttpCore((opts) => {
  opts.dataSourceToken = DATA_SOURCE_TOKEN
  opts.http.client.baseURL = 'https://pokeapi.co/api/v2/'
  opts.resilience.retry.attempts = 3
  opts.resilience.circuitBreaker.consecutiveFailures = 5
})
```

---

## 📂 Project Structure

| File            | Responsibility                                        |
| --------------- | ----------------------------------------------------- |
| `bootstrap.ts`  | Configures the IoC container and resilience policies. |
| `index.ts`      | Server entry point; consumes the `DataSource`.        |
| `tokens.ts`     | Defines the injection tokens for loose coupling.      |
| `tsconfig.json` | Path aliasing for direct framework debugging.         |
