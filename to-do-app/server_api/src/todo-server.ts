import express, {NextFunction, Request, Response} from 'express';
import * as http from "node:http";
import cors from 'cors';
import {TodoFileDb} from "./todo/store/todo-file-db.js";
import {TodoService} from "./todo/service/todo-service.js";
import {TodoApi} from "./todo/api/todo-api.js";
import {ValidationError} from "./util/parser/validation-error.js";
import {Respond} from "./util/api/request-handler.js";
import {HttpError} from "./util/error/http/http-error.js";
// jwt Middleware importieren
import { jwtAuth } from "./auth-middleware/jwt-auth.js";


/**
 * Configuration for the to-do server.
 */
type TodoServerConfig = {
  /**
   * The port to listen on, e.g., 8080
   */
  port: number;
  /**
   * The hostname to listen on, e.g., localhost or api from api.mni.thm.de.
   */
  host: string;

  /**
   * The configuration for the database.
   */
  dbConfig: FileDBConfig;
}

/**
 * Configuration for the file-based database.
 */
type FileDBConfig = {
  dbFilePath: string;
}

/**
 * A singleton class that starts a server and serves the to-do API.
 */
export class TodoServer {
  private static instance: TodoServer;

  /**
   * Starts the server and serves the to-do API.
   * @param server Express server
   * @param onStop Callback function to be called when the server is stopped
   */
  private constructor(
    private server: http.Server,
    private onStop: () => void,
  ) {}

  /**
   * Starts the server and serves the to-do API. If the server is already started, it returns the existing instance.
   *
   * @param config Configuration for the server
   * @param onStart Callback function to be called when the server is started
   * @param onStop Callback function to be called when the server is stopped
   * @param onError Callback function to be called when an error occurs
   *
   * @returns The singleton instance of the TodoServer
   */
  public static start(
    config: TodoServerConfig,
    onStart: () => void,
    onStop: () => void,
    onError: (err: Error) => void
  ): TodoServer {
    if (!TodoServer.instance) {
      const app = express();


     app.use(express.json());

      // CORS configuration to allow requests from the client application
      app.use(cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type','Authorization'],
        credentials: true,
      }));

      // JWT-Middleware aktivieren (vor API!)
      app.use("/todos", jwtAuth);

      // Handle JWT-Fehler gezielt
      // @ts-ignore
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err.name === "UnauthorizedError") {
          console.warn("JWT Error:", err.message);
          res.status(401).json({ error: "Invalid or missing token" });
        } else {
          next(err);
        }
      });

      const todoDb = new TodoFileDb(config.dbConfig.dbFilePath);
      const todoService = new TodoService(todoDb);
      const todoApi = new TodoApi(todoService);
      todoApi.appendRouting(app);

      // Register global error handling to ensure that all errors are caught and a http response is sent
      app.use(TodoServer.errorHandler);

      const server = app.listen(config.port, config.host, onStart);
      server.on('error', onError);

      this.instance = new TodoServer(server, onStop);
    }

    return TodoServer.instance;
  }

  /**
   * Stops the server from accepting new connections and calls the onStop callback function.
   */
  public stop(): void {
    this.server?.close(() => this.onStop());
  }

  private static errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
      console.debug(err.stack);
      res.status(400).send(Respond.failure(err.message, 400));
      return;
    }

    if (err instanceof HttpError) {
      if (err.status >= 500) {
        console.error(err.stack);
        res.status(err.status).send(Respond.internalServerError('Internal server error!'));
      } else {
        console.debug(err.stack);
        res.status(err.status).send(Respond.failure(err.message, err.status));
      }
    } else {
      console.error(err.stack);
      res.status(500).send(Respond.internalServerError('Internal server error!'));
    }
  }
}
