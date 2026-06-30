# @gantry5/create

The official scaffolding tool for **Gantry5**. This CLI allows you to quickly
bootstrap a production-ready Node.js application based on Gantry5, following
Domain-Driven Design (DDD) and Clean Architecture principles.

## 🚀 Quick Start

To create a new Gantry5 project, simply run:

```bash
npx @gantry5/create my-gantry5-app

```

The CLI will guide you through an interactive setup to select the modules you
need (Database, HTTP, Auth, Logging, etc.).

---

## 🛠 Usage

### Command Line Arguments

You can specify the project directory directly:

```bash
npx @gantry5/create <project-name>

```

### Modes

The CLI supports optional flags to bypass the interactive prompt:

- **`--full`**: Scaffolds a project with all enterprise features enabled
  (Drizzle ORM, Axios, Supabase, Logging, etc.).
- **`--empty`**: Scaffolds a minimal Gantry5 project without additional
  infrastructure plugins.

---

## 🏗 Architecture & Extensibility

The CLI is designed with a highly modular architecture based on the **Generator
Pattern**. This allows for easy maintenance and expansion of scaffolding
capabilities.

### How it works:

1. **`ScaffoldingEngine`**: The central orchestrator. It receives a list of
   `IGenerator` implementations and executes them in sequence.
2. **Generators**: Located in `src/generators/`, each class implements the
   `IGenerator` interface and is responsible for a single file or a specific
   feature (e.g., `DrizzleGenerator`, `PackageJsonGenerator`).

### Adding a new feature/file:

To add a new file or configuration option to the scaffolding process:

1. Create a new class in `src/generators/` that implements `IGenerator`.
2. Add it to the list of generators in `src/index.ts`.
3. The `ScaffoldingEngine` will automatically pick it up and execute it based on
   the `shouldGenerate()` logic.

---

## 💻 Development

If you are contributing to the CLI or running it locally from source:

### Prerequisites

- Node.js 18+

### Setup

1. **Clone the repository** and enter the `cli/` directory.
2. **Install dependencies**:

```bash
npm install

```

3. **Run in development mode**:

```bash
npm run dev

```

### Scripts

- `npm run build`: Compiles the TypeScript source into the `dist/` folder.
- `npm run dev`: Runs the CLI using `tsx` for immediate development feedback.

---

## 🛡 License

This project is licensed under the **ISC License**.
