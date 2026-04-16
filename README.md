# To-Do App

This is a simple to-do application built with TypeScript and JavaScript.
The app allows users to manage their tasks by creating, editing, deleting, and marking them as done.
It also supports sorting and filtering tasks based on various criteria.

## Team members
- Muaaz Ahmed Shahzad
- Mohamad Badr H.Ali

## Prerequisites

Before building and running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (for running the containerized version)

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <repo-root>/to-do-app
   ```

2. Create your local environment file:
   ```bash
   npm run setup
   ```

3. Set strong values in `.env` for:
   - `IDP_DB_USER`
   - `IDP_DB_PASSWORD`
   - `TODO_DB_USER`
   - `TODO_DB_PASSWORD`
   - `TODO_DB_ROOT_PASSWORD`

4. Install dependencies:
   ```bash
   npm run install
   ```

## Build

To build the project, run:
```bash
npm run build
```

This will compile the TypeScript code into JavaScript and place the output in the `build` directory.

## Start

To start the project, run:
```bash
npm start
```

This starts only the `server_api` service (default: `http://localhost:8080`).
For the full application stack (client, idp, databases), use Docker Compose.

## NPM Scripts
The following NPM scripts are available:

Create a local `.env` from `.env.example` (does not overwrite existing `.env`):
```bash
npm run setup
```

Create a production-ready build for both client and server:
```bash
npm run build:prod
```

Build the Docker image for the application:
```bash
npm run build:docker
```

Start the application in a Docker container
```bash
npm run start:docker
```

Build the Docker image and start the application with Docker Compose for the first time:
```bash
npm run firststart:compose
```

Start the application with Docker Compose (after the initial build):
```bash
npm run start:compose
```

Stop the Docker Compose services:
```bash
npm run stop:compose
```

## Build and Start with Docker Compose
1. Ensure `.env` exists and contains your local credentials (`npm run setup`).
2. Install dependencies with `npm run install`.
3. Build the production version with `npm run build:prod`.
4. Start the application using Docker Compose:
```bash
  npm run firststart:compose
```
Or, if the application is already built, start it with:
```bash
  npm run start:compose
```
5. To stop the application:
```bash
  npm run stop:compose
```

## Service Ports (Docker Compose defaults)
- `todo-client-nginx`: `http://localhost:8080`
- `todo-app-server`: `http://localhost:8081`
- `echo-service-api`: `http://localhost:8088`
- `identity-provider`: `http://localhost:8090`
- `adminer`: `http://localhost:8083`
- `todo_postgres`: `localhost:8999 -> 5432`
- `todo_database` (MariaDB): `localhost:3307 -> 3306`

## Login Test User (verified)
After starting with Docker Compose, open:
- `http://localhost:8080`
or directly:
- `http://localhost:8080/authForm.html`

Use this seeded user (from `identity-provider-wip/idp/init/initial_schema.sql`):
- Email: `max.mustermann@mni.thm.de`
- Password: `password`

## Troubleshooting
If login fails after you changed DB credentials in `.env`, your old database volume may still contain the previous user/password.
Re-initialize once with:

```bash
npm run stop:compose
docker compose down -v
npm run start:compose
```

This removes local Docker volumes for this stack.
