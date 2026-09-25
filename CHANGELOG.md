# Changelog

All notable changes to Xeno.JS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.0.html).

## [0.1.0] - 2026-09-24

### Added

- Core architecture primitives (`@xeno-js/core`) implementing Clean
  Architecture, DDD, and CQRS patterns.
- Explicit Dependency Injection (IoC) container with request-scoped execution
  contexts via `AsyncLocalStorage`.
- Robust middleware security stack including CSRF dual-token protection, Rate
  Limiting, CORS, and Method checks.
- Vue.js integration package (`@xeno-js/vue`) featuring the `ClientMediator` and
  reactive composables.
- Scaffolding CLI (`@xeno-js/cli`) for rapid command, query, and handler
  generation.

### Fixed

- Fixed bundling errors where Axios attempted to load native Node.js modules
  (`util`, `form-data`) in browser environments by updating `tsup.config.ts`
  external rules.
- Stabilized full-stack authentication flow utilizing the Double Submit Cookie
  pattern.

### Security

- Implemented cryptographic nonce generation and timing-safe HMAC SHA-256
  signature validation via `CsrfTokenService`.

## [0.1.10] - 2026-09-25

### Refactoring

- **core:** optimize module container registration and trim app registry
