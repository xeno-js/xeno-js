## Contributing to Xeno.JS

Contributions are welcome! Whether you want to fix a bug, improve documentation, or introduce a new adapter, please follow the workflow below to keep the codebase consistent and reliable.

### Development Workflow

Xeno.JS uses two main branches:

* **`develop`** — The default branch and the primary integration branch. New features and fixes are merged here first, where they can be tested and validated.
* **`main`** — The stable release branch. Changes are merged from `develop` into `main` when they are ready for release. Packages are published from `main`.

All contributions must target `develop`, not `main`.

### How to Contribute

1. **Start from `develop`**

   Fork the repository, then create your feature branch from the latest `develop` branch.

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/hono
   ```

   Choose a descriptive branch name that reflects your contribution. Examples:

   * `feature/hono`
   * `feature/sqlite`
   * `fix/container-resolution`
   * `docs/update-quickstart`
   * `refactor/adapter-registration`

2. **Make your changes**

   Follow the existing code style and architecture. For new packages and adapters, follow the established conventions and keep changes focused on the intended functionality.

3. **Run the checks**

   Before committing your changes, run:

   ```bash
   npm run check
   ```

   This command must complete successfully. It runs the project's configured checks, including linting and type checking, as well as any other checks configured by the project.

   **Test coverage requirement:** Contributions must maintain at least **80% test coverage**. Add or update tests to cover new functionality and prevent regressions.

4. **Open a Pull Request**

   Push your branch and open a pull request targeting **`develop`**.

   Your pull request should include:

   * A clear description of the changes and their motivation.
   * Relevant tests for new features or bug fixes.
   * Confirmation that `npm run check` passes.
   * Any documentation updates needed to explain the changes.

5. **Review and integration**

   Pull requests are reviewed before being merged into `develop`. Changes are tested and validated in `develop` before being considered for integration into `main`.

   Only changes merged into `main` are included in the corresponding package release workflow.

### Contributing New Adapters

New adapters and integrations are welcome, including integrations for HTTP frameworks, databases, and other infrastructure.

Before starting a substantial new adapter, consider opening an issue or discussion to align on its scope and expected integration with the Xeno.JS architecture.

Official packages under the `@xeno-js/*` scope must follow the project's conventions and be reviewed by the maintainers before acceptance and release.

### Code Quality

We aim to maintain a reliable and maintainable codebase. All contributions are expected to:

* Follow the existing TypeScript conventions.
* Pass `npm run check`.
* Maintain at least 80% test coverage.
* Include tests for relevant functionality.
* Avoid introducing unnecessary coupling between business logic and infrastructure.
* Keep documentation up to date when public APIs or workflows change.

Thank you for helping improve Xeno.JS!
