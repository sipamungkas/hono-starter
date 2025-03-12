# Bun with HONO starter template

This is a personal starter template for HONO with drizzle as orm. In this project I will use postgres for the database.

## Project Structure

```plaintext
src/
├── config/
│   ├── database.ts        # Drizzle DB connection setup
│   └── env.ts             # Environment variables with validation
├── controllers/
│   └── auth.controller.ts # Handles HTTP requests/responses
├── models/
│   └── user.model.ts      # Drizzle schema definitions
├── repositories/
│   └── user.repository.ts # Database access logic
├── services/
│   └── auth.service.ts    # Business logic
├── middleware/
│   ├── error.middleware.ts
│   └── auth.middleware.ts # JWT verification etc.
├── utils/
│   ├── password.ts        # Password hashing
│   └── token.ts           # JWT generation/validation
├── types/
│   └── index.ts           # TypeScript interfaces/types
├── routes/
│   └── auth.route.ts      # Route definitions
└── index.ts               # Application entry point
```

## Packages

Here’s a table describing each package listed in your `package.json`, along with their uses:

| Package Name          | Description                                                                                                  | Use                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `@hono/zod-validator` | A validation library that integrates Zod with Hono, allowing for schema-based validation of requests.        | Used to validate incoming request data against defined schemas, ensuring data integrity.     |
| `bcryptjs`            | A library to help hash passwords using the bcrypt algorithm, providing security for user credentials.        | Used for securely hashing and comparing passwords during user authentication.                |
| `drizzle-orm`         | An Object-Relational Mapping (ORM) library for TypeScript and JavaScript, simplifying database interactions. | Used to define models and interact with the PostgreSQL database in a type-safe manner.       |
| `hono`                | A lightweight web framework for building APIs and web applications, designed for performance.                | Used as the main framework for handling HTTP requests and routing in the application.        |
| `jose`                | A library for creating and verifying JSON Web Tokens (JWTs), providing secure token-based authentication.    | Used for generating and validating JWTs for user sessions and API security.                  |
| `pg`                  | A PostgreSQL client for Node.js, allowing for database connections and queries.                              | Used to connect to and interact with the PostgreSQL database directly.                       |
| `postgres`            | A modern PostgreSQL client for Node.js, providing a simple and efficient way to interact with PostgreSQL.    | Used as an alternative to the `pg` package for database operations, focusing on performance. |
| `zod`                 | A TypeScript-first schema declaration and validation library, allowing for type-safe data validation.        | Used to define and validate data schemas, ensuring that data conforms to expected types.     |

This table summarizes the purpose and functionality of each package in your project.

## Run Development

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000
