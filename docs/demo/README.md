---
id: demo-overview
slug: /demo
sidebar_label: Executable Demos
---

# Gear5 Executable Demos

Welcome to the live executable demonstration suite of the Gear5 framework. This
section provides a hands-on exploration of complete, decoupled architecture
patterns mapping clean enterprise topologies.

Instead of writing theoretical examples, these configurations are
production-ready code modules designed under Domain-Driven Design (DDD) and
Command Query Responsibility Segregation (CQRS) boundaries.

---

## Architecture Scenarios & Links

Explore the technical blueprints and executable workflows detailed across our
core demo modules:

- **[CQRS & Mediator Pipeline](https://github.com/Mattia-Carcione/gear5/tree/develop/demo/pipelines_middleware_demo)**
  Inspect the entrypoint for message routing, asynchronous mediator dispatches,
  and the layered execution of sequential Cross-Cutting behaviors (Logging,
  Validation, Performance tracking).
- **[Database & Drizzle ORM Integration](https://github.com/Mattia-Carcione/gear5/tree/develop/demo/database_drizzle_demo)**
  Review automated data mapper isolation, strongly-typed repository components,
  transactional units of work, and Fluent Filter compilation grids interfacing
  with PostgreSQL.
- **[Resilient HTTP Core Subsystem](https://github.com/Mattia-Carcione/gear5/tree/develop/demo/http_core_demo)**
  Examine the architectural integration of fault-tolerant external data sources
  orchestrated concurrently via Axios and Cockatiel sandboxed
  retry/circuit-breaker rings.
- **[Full Middleware & Context Integration](https://github.com/Mattia-Carcione/gear5/tree/develop/demo/pipelines_middleware_demo)**
  Trace an execution thread from the raw HTTP transport presentation layer,
  through automated metadata header extraction, into AsyncLocalStorage thread
  isolation boundaries.

---

## Local Execution Environment

To spin up any specific demo environment locally on your workstation, navigate
into its root directory inside the framework core repository and hydrate its
local node module ecosystem:

```bash
cd demo/http_core_demo
npm install
npm run dev
```
