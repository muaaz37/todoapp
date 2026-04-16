# API Server Documentation

The `server_api` application is a TypeScript-based server that provides a RESTful API for managing to-do items.
It uses Express.js as the web framework and a file-based database for storing to-do data.
The server supports basic CRUD operations for to-do items and includes features such as sorting and filtering.

## API Overview

The API provides endpoints for managing to-do items, including creating, retrieving, updating, and deleting items.

### To-Do Item Structure

Each to-do item has the following structure:

**Todo**:
```json
{
  "id": "UUID V4",
  "title": "string (length >= 3)",
  "description": "string",
  "status": "string { done | open }",
  "dueDate": "(optional) string (ISO 8601 format)",
  "createdAt": "string (ISO 8601 format)"
}
```

The api uses DTO (Data Transfer Object) pattern to define updates to the todo items set.
The id and createdAt fields are not included in the DTOs, are not updatable and will be initially set by the server to
random UUID v4 and the current date respectively.
The status field is set to "open" by default when creating a new todo item.

**CreateTodo**:
```json
{
  "title": "string (length >= 3)",
  "description": "string",
  "dueDate": "(optional) string (ISO 8601 format)"
}
```

**UpdateTodo**:
```json
{
  "title": "string (length >= 3)",
  "description": "string",
  "status": "string { done | open }",
  "dueDate": "(optional) string (ISO 8601 format)"
}
```

**Status**:
```json
{
  "status": "string { done | open }"
}
```

### Response Structure

The API responses are in JSON format and include entities inside a `data` field of a JSON object.:

**Message**:
```json:
{
  "data": "Todo | Todo[]",
  "message": string,
  "status": "number (http status code)"
}
```

### Endpoints

The following endpoints are available for managing to-do items:

| METHOD | PATH              | QUERY Parameter                | REQUEST Body | RESPONSE Body   | Response Status |
|--------|-------------------|--------------------------------|--------------|-----------------|-----------------|
| GET    | /todos            | (optional) sort, order, filter | -            | Message<Todo[]> | 200             |
| POST   | /todos            | -                              | CreateTodo   | Message<Todo>            | 201             |
| GET    | /todos/:id        | -                              | -            | Message<Todo>            | 200, 404        |
| PUT    | /todos/:id        | -                              | UpdateTodo   | Message<Todo>            | 200, 404        |
| PATCH  | /todos/:id/status | -                              | Status       | Message<Todo>            | 200, 404        |
| DELETE | /todos/:id        | -                              | -            | Message<Todo>            | 200, 404        |

Depending on the request, the server will return the following HTTP error status codes:
- 400: Bad Request - Invalid request body or parameters (e.g., invalid query parameters).
- 500: Internal Server Error - An unexpected error occurred on the server.

### Query Parameters

- **sort**: Attribute to sort the to-do items by (e.g., `title`, `status`, `dueDate`, `createdAt`).
- **order**: Order of sorting (`asc` or `desc`).
- **filter**: Filter options for to-do items (e.g., `title`, `status`).

## Architecture Description

The project follows a common three-layer architecture pattern:
- **Web-Layer**: Handles incoming requests and responses. It validates input data and actions to the service layer.
- **Service Layer**: Contains the business logic for managing to-do items. It interacts with the data access layer to perform CRUD operations.
- **Persistence Layer**: Manages the interaction with the database. It provides methods for reading and writing to-do items.

### Project Structure

The project is organizer by feature folders and follows a modular architecture.
The main folders are:

- `server_api/src/todo`: Contains the login for the to-do feature.
- `server_api/src/util`: Contains utility functions and classes.

Furthermore, the project is organized into the following main components:

- `server_api/src/start.ts`: Entry point for starting the server.
- `server_api/src/todo-server.ts`: Defines the `TodoServer` class, which sets up and manages the Express server.
- `server_api/src/todo/store/`: Implements the database access for managing to-do items in a persistent manner.
- `server_api/src/todo/api/`: Defines the API routes and handlers for to-do operations.
- `server_api/src/todo/service/`: Contains the business logic for managing to-do items.
- `server_api/src/util/api/`: Utility functions for handling API requests and responses.
- `server_api/src/util/error/http/`: Custom error classes for handling HTTP errors.
- `server_api/src/util/parser/`: Custom error class for handling validation errors.

### Error Handling

The server includes global error handling middleware to catch and respond to errors consistently. It distinguishes between validation errors, HTTP errors, and general server errors, providing appropriate responses and logging.

### Configuration

The server configuration is defined in the `start.ts` file, which includes settings for the server port, host, and database file path. These settings can be customized using (optional) environment variables.

Environment variables:
- `PORT`: The port on which the server will listen (default: 3000).
- `HOST`: The host address for the server (default: `localhost`).
- `DB_FILE_PATH`: The path to the file-based database (default: `./todos.json`).

### Signal Handling

The server registers signal handlers for `SIGINT` and `SIGTERM` to ensure graceful shutdown. This allows the server to close connections and process its queued requests before exiting.
