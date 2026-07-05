# Demo 02 - CQRS & Security Middleware Architecture with Xeno

This demonstration project showcases how to configure and run an asynchronous,
contract-driven CQRS application using the **Xeno** framework. It establishes an
enterprise-grade ingress configuration using Fastify as the transport server,
protected by integrated context-tracking, identity propagation, authorization
policies, and command idempotency middleware layers.

---

## Prerequisites

Before setting up and running this application, ensure you have the following
installed on your machine:

- **Node.js** (v20.0.0 or higher recommended)
- **npm** (comes bundled with Node.js)
- An active database node compatible with Drizzle ORM (e.g., PostgreSQL
  instance)

---

## Installation & Setup Manual

Follow these sequential steps to initialize, configure, and launch the
application kernel locally:

### 1. Configure Environment Variables

Create a `.env` configuration file from .env.example in the root of the
`pipelines_middleware_demo` directory. Add your database access credentials:

```env
DATABASE_URL=postgres://username:password@localhost:5432/your_database_name

```

_Note: The system bootstrap engine requires a defined `DATABASE_URL` string
variable; leaving it undefined will cause an immediate compilation crash during
initialization._

### 2. Install Dependencies

Navigate into the project workspace directory and invoke the package
installation command:

```bash
npm install

```

This setups the required runtime environment dependencies, mapping Fastify for
routing, Dotenv for configuration, and TSX for execution without dynamic
compilation steps.

### 3. Sync the Database Schema

Apply the object schema tables directly to your database instance using Drizzle
Kit push macros:

```bash
npm run db:push

```

### 4. Launch the Active Run Loop

Start the Fastify transport server engine in local development execution mode:

```bash
npm start

```

Upon a successful initialization sequence, you should observe the following
confirmations printed to your terminal shell:

```text
⚙️ Initialized Xeno Container...
🚀 Starting Fastify server on http://localhost:3000...
✅ Middleware and Controllers resolved from the container.
✅ Fastify instance created. Setting up routes...
✅ Routes set up. Ready to accept requests.
🚀 Execution Demo 02 running on http://localhost:3000

```

---

## API Documentation & Controller Usage Examples

The transport server maps incoming connections to three distinct controllers,
executing each path within the protected request-scoped context pipeline.
Because the authorization subsystem is enabled, certain routes validate identity
configurations such as security keys, user roles, or fine-grained action
permissions before processing intent commands.

### 1. Save User Controller (`POST /api/user/save`)

- **Controller Implementation**: `SaveUserController`
- **Behavior**: Receives raw `UserProps` input, builds a type-safe `UserCommand`
  intent contract, passes it to the Mediator bus, and returns an HTTP
  `201 Created` status code upon a successful commit.
- **Configured Policies**: Enforces command idempotency locking parameters for a
  duration ceiling of 30 seconds.

#### Sample cURL Request:

```bash
curl -X POST http://localhost:3000/api/user/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-valid-jwt-token" \
  -H "x-correlation-id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "x-request-id: 740f9311-b38c-52e5-b827-557766551111" \
  -d '{
    "userId": "user-123",
    "tenantId": "tenant-456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'

```

---

### 2. Find User Controller (`GET /api/user/:id`)

- **Controller Implementation**: `FindUserController`
- **Behavior**: Extrapolates the target identifier string parameter from the
  route pattern path, dispatches a read-only `UserQuery` contract down the
  mediator bus, and resolves a standardized HTTP `200 OK` model payload.
- **Configured Policies**: Security rules evaluate client identity states to
  verify the inclusion of the `read` permission claim signature.

#### Sample cURL Request:

```bash
curl -X GET http://localhost:3000/api/user/user-123 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer mock-valid-jwt-token" \
  -H "x-correlation-id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "x-request-id: 981a2422-c49d-63f6-c938-668877662222"

```

---

### 3. Simulated Unauthorized Controller (`GET /api/unauthorized`)

- **Controller Implementation**: `UnauthorizedController`
- **Behavior**: Triggers a simulated execution pathway mapping an
  `UnauthorizedAccessCommand` contract.
- **Configured Policies**: The authorization middleware evaluates access
  criteria, requiring the user payload to match the `admin` role and provide
  both `read` and `write` permission claims. If incoming identity headers omit
  these credentials, the framework catches the policy failure early within the
  execution behavior chain, short-circuiting to return an HTTP
  `401 Unauthorized` outcome.

#### Sample cURL Request (Triggers Access Violation):

```bash
curl -X GET http://localhost:3000/api/unauthorized \
  -H "Accept: application/json" \
  -H "Authorization: Bearer mock-guest-token" \
  -H "x-correlation-id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "x-request-id: 112b3533-d50e-74a7-d049-779988773333"

```
