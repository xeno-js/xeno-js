# Gantry5 Demos

Welcome to the **Gantry5** demo suite. This directory contains a set of
operational, sandbox environments designed to showcase specific architectural
patterns and decoupled enterprise topologies using the Gantry5 framework.

These demos serve as practical "labs" to help you understand how to assemble
your application using the `AppBuilder` and various Gantry5 modules.

---

## ⚡ Scaffolding New Projects

If you are looking to start a new architecture from scratch, we highly recommend
using the official Gantry5 scaffolding CLI. It automates project setup and
handles the configuration of modules for you.

- 👉 **[See how to use the CLI](../cli/README.md)**

---

## 🧪 Available Demos

Each demo folder contains a self-contained application. You can explore the
source code to see how specific enterprise concerns are implemented.

### 1. `pipelines_middleware_demo/`

This demo traces an execution thread from the raw HTTP transport presentation
layer, executing automated header extraction and anchoring metadata variables
into `AsyncLocalStorage` thread boundaries.

- 👉
  **[Explore Pipeline & Middleware Implementation](./pipelines_middleware_demo/README.md)**

### 2. `http_core_demo/`

Examines the architectural configuration of fault-tolerant external data
sources, orchestrated concurrently via sandboxed Axios instances and Cockatiel
policy rings.

- 👉
  **[Explore HTTP Core & Resilience Implementation](./http_core_demo/README.md)**

### 3. `database_drizzle_demo/`

Reviews automated data mapper isolation, strongly-typed repository components,
transactional units of work, and Fluent Filter compilation grids interfacing
with PostgreSQL via Drizzle ORM.

- 👉
  **[Explore Database & Persistence Implementation](./database_drizzle_demo/README.md)**

---

## 🏃 How to Run the Demos

To get started with any of these demos:

1. **Navigate to the demo folder**: `cd demo/[demo-name]`
2. **Install dependencies**: `npm install`
3. **Run the application**: `npm start`

Each project uses `tsx` to execute TypeScript directly, allowing for a fast
feedback loop. Check the `package.json` inside each folder for specific scripts
and available commands.
