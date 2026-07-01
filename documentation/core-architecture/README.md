---
title: Core Architecture & Lifecycle
sidebar_position: 2
slug: ./
description:
  Technical index and summary of the core runtime engine, application hosting
  lifecycle, and IoC service container mechanics of XenoJS.
keywords:
  - core architecture
  - dependency injection lifetimes
  - application hosting
  - module composition
  - bootstrap engine
---

# Core Architecture & Lifecycle

This chapter encapsulates the deep programmatic primitives that govern the
instantiation, compilation, tracking, and teardown of a XenoJS framework
environment.

By entirely eliminating reflection, runtime decorator overhead, and ambient
magic metadata parsing, the core engine achieves near-instantaneous startup
sequences, optimized specifically for high-efficiency distributed environments
and serverless runtimes.

---

## Chapter Summary

The _Core Architecture & Lifecycle_ layer acts as the foundational engine room
of XenoJS. It isolates how an unhydrated host translates declarative
configurations, manages graph dependency validation safely through nominal type
tokens, handles scoped memory isolation blocks, and exposes macro structural
plugins. Understanding these core components is essential before implementing
use cases or writing custom domain application handlers.

---

## Document Directory

Navigate through the foundational runtime structural paths sequentially:

### 1. [Application Hosting & Fluent Bootstrap Engine](./application-hosting-bootstrap-engine.md)

- **What it covers:** An anatomical deep dive into the fluent `AppBuilder`
  orchestrator model, the separate roles of the `bootstrap.ts` configuration
  script and `main.ts` process runtime, and the multi-step lazy-loading workflow
  executed during container compilation.

### 2. [The IoC Container & Service Lifetimes](./ioc-container-service-lifetimes.md)

- **What it covers:** An explicit technical manual on how XenoJS allocates
  instance tracking behaviors across its three native lifecycles: `Singleton`,
  `Scoped`, and `Transient`. It includes complete implementation analysis of
  `IServiceScopeFactory`, thread scope creation during active requests, and safe
  garbage collection mechanics via explicit resource cleanup lookups
  (`.dispose()`).

### 3. [Module Composition Pattern](./module-composition-pattern.md)

- **What it covers:** Best-practice architectural blueprints for encapsulating
  features and domain blocks using the clean `IModule` implementation interface.
  This section reveals how core systems (such as `CqrsModule`, `DbModule`, and
  `HttpCoreModule`) use their `.configure()` loops to hook into the
  `IServiceContainer` safely without exposing private inner classes.

---

## The Container Compilation Lifecycle Trace

The following workflow charts the logical transformation from raw, unhydrated
builder options to a sealed, thread-safe, and production-ready service
container:

```mermaid
sequenceDiagram
    autonumber
    participant Main as src/main.ts
    participant Builder as AppBuilder Instance
    participant Module as IModule Implementations
    participant Container as ServiceContainer (Sealed)

    Main->>Builder: New AppBuilder()
    Main->>Builder: Chain Configurations (.addContext, .addPipeline)
    Main->>Builder: Execute .build()
    activate Builder
    Builder->>Module: Fire async .configure(container, options) loop
    activate Module
    Module->>Builder: Bind nominal factories (.addSingleton, .addScoped)
    deactivate Module
    Builder->>Builder: Perform structural validation & graph validation checks
    Builder->>Container: Seal Registry Map & Freeze Instantiator References
    deactivate Builder
    Container-->>Main: Return ready IServiceContainer

```

---

## Core Best Practices at a Glance

:::info Always structure large-scale micro-features into self-contained
`IModule` classes. Never allow distinct domain use cases to inject dependencies
globally outside of their designated module configuration block. :::

:::tip TIP: Lifetimes Matter

- Always map long-lived, stateless shared wrappers (like an HTTP engine client
  or database pool abstraction) as **Singletons**.

- Always keep web request parameters, user authentication claims, and tracking
  contexts strictly isolated within **Scoped** lifecycles. :::

---

## Next Step

Begin by reviewing the composition layout of the primary application bootstrap
orchestrator:

- 👉
  **[Proceed to Application Hosting & Fluent Bootstrap Engine](./application-hosting-bootstrap-engine.md)**
