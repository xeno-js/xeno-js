# Xeno.JS Evolution Roadmap

This roadmap outlines the next evolutionary steps for **Xeno.JS**, aiming to
transform it into an increasingly modular, secure application architecture
framework ready for distributed environments and microservices, while minimizing
constraints with external libraries or rigid transport frameworks.

---

## 🎯 Main Objectives

1. **Modularity and Feature Toggles (Transport Decoupling):** Make every HTTP
   and transport module completely optional (`on/off`), allowing the framework
   to start without any forced dependencies on third-party libraries.
2. **Standardization and Security:** Standardize configuration nomenclature
   (`config`) and enhance security mechanisms (advanced cookie management, CSRF
   protection, and identity validation).
3. **Event-Driven Communication and Microservices:** Introduce native support
   for asynchronous message brokers, starting with **RabbitMQ**, while
   maintaining the consistency of the CQRS pattern (commands and distributed
   events).

---

## 🚀 Development Phases

### Phase 1: Security Hardening & Configuration Standardization

_Improving middleware security and cleaning up the configuration DX._

- [ ] **Standardization of Configuration Options:** Redesign and normalize the
      naming convention of configuration interfaces in the `AppBuilder`
      (`MiddlewareConfig`, `AuthConfig`, etc.) to ensure a consistent and
      intuitive Developer Experience (DX).
- [ ] **Strengthening Security Middlewares:**
- Consolidate the lifecycle of `CsrfMiddleware` and secure cookie management
  (`__Host-` prefixes, `HttpOnly`, `Secure`, and `SameSite=Strict` flags).
- Optimize the "Fail-First" strategy in the `GateKeeper` for rigorous management
  of expired/invalidated tokens (`401` immediate and explicit response).

### Phase 2: Modular HTTP & Transport Decoupling

_Eliminating rigid dependencies and introducing on/off feature flags._

- [ ] **Redesigning Transport Modules as Independent Plugins:**
- Transform existing adapters (Fastify, Vercel, native Node) into packages or
  modules activated via boolean flags or explicit factories in the `AppBuilder`
  (e.g., `.addHttpCore({ enabled: true })`).

### Phase 3: Distributed Systems & RabbitMQ Integration

_Expanding toward microservices and asynchronous communication._

- [ ] **Message Bus Abstraction:** Define base contracts (`IMessageBus`,
      `IEventPublisher`, `IEventSubscriber`) within the shared ecosystem.
- [ ] **RabbitMQ Module Implementation (`@xeno-js/rabbitmq` or integrated core
      module):**
- Native integration configurable via the `AppBuilder` (e.g.,
  `.addRabbitMq(...)`).
- Support for publishing domain events and listening to distributed
  commands/messages.
- Synchronization of `RequestContext` and tracking (`correlationId`,
  `requestId`) across RabbitMQ messages to ensure end-to-end observability in
  microservices.

---

## 🤝 How to Contribute

Xeno.JS is an open-source project driven by the pursuit of a clean and rigorous
architecture in TypeScript.

If you want to contribute to the development of these phases, suggest
improvements, or start a discussion about a feature:

1. Give a ⭐ to the repository on GitHub.
2. Open an _Issue_ or a _Pull Request_ to discuss important architectural
   changes prior to implementation.
3. Share your real-world usage feedback: help us keep Xeno.JS a solid and
   long-lasting tool over time.

**[READ HOW TO CONTRIBUTE](./CONTRIBUTING.md)**
