import {Locals, NextFunction, Request, Response} from "express";

/**
 * Type of request parameters.
 */
export type RequestParams = { [key: string]: string };

/**
 * Type of request body.
 */
export type RequestBody = any;
/**
 * Type of request query.
 */
export type RequestQuery = {
  [key: string]: string | string[] | undefined;
}

/**
 * Type of request query.
 */
type HandlerFunction<T> = (
  req: Request<RequestParams, Message, RequestBody, RequestQuery, Locals>
) => Promise<ErrorMessage | DataMessage<T>>;

/**
 * Type of return handler function.
 */
type ReturnHandlerFunction = (
  req: Request<RequestParams, Message, RequestBody, RequestQuery, Locals>,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Utility class for handling requests and responses in a consistent way.
 */
export class RequestHandler {

  /**
   * Creates a handler function that embeds the provided function to the Express native request handler with
   * error handling which forwards the error to the express middleware error chain.
   *
   * @param f The function to be called when the request is received.
   *
   * @returns A function that can be used as a request handler in Express.
   */
  public static handle<T>(f: HandlerFunction<T>): ReturnHandlerFunction {
    return async (req, res, next) => {
      try {
        const response = await f(req);
        res.setHeader(`Content-Type`, `application/json`);
        res.status(response.status).send(response);
      } catch (err) {
        next(err);
      }
    };
  }

  private constructor() {
    throw new Error(`This class cannot be instantiated.`);
  }
}

/**
 * Utility class for creating json responses.
 */
export class Respond {

  /**
   * Creates a response with the given data and status code 200.
   *
   * @param data The data to be included in the response.
   *
   * @returns A DataMessage object.
   */
  public static ok<T>(data: T): DataMessage<T> {
    return {
      data: data,
      message: 'Success',
      status: 200
    };
  }

  /**
   * Creates a response with the given data and status code 201.
   *
   * @param data The data to be included in the response.
   *
   * @returns A DataMessage object.
   */
  public static created<T>(data: T): DataMessage<T> {
    return {
      data: data,
      message: 'Created',
      status: 201
    };
  }

  /**
   * Creates a response with the given data and status code 202.
   *
   * @returns A Message object.
   */
  public static accepted(): Message {
    return {
      message: 'Accepted',
      status: 202
    };
  }

  /**
   * Creates a response with the given data and status code 204.
   */
  public static noContent(): Message {
    return {
      message: 'No Content',
      status: 204
    };
  }

  public static badRequest(message: string): ErrorMessage {
    return Respond.failure(message, 400);
  }

  /**
   * Creates a not found message with the given message string and status code 404.
   *
   * @param message The message to be included in the response.
   *
   * @returns A Message object.
   */
  public static notFound(message: string): ErrorMessage {
    return Respond.failure(message, 404);
  }

  /**
   * Creates a response with the given message and status code 500.
   *
   * @param message The message to be included in the response.
   *
   * @returns A Message object.
   */
  public static internalServerError(message: string): ErrorMessage {
    return Respond.failure(message, 500);
  }

  /**
   * Creates a response with the given message and status code.
   *
   * @param message The message to be included in the response.
   * @param status The status code of the response.
   *
   * @returns A Message object.
   */
  public static failure(message: string, status: number): ErrorMessage {
    return {
      message: message,
      status: status
    };
  }
}

/**
 * Message object containing data.
 */
export interface DataMessage<T> extends Message {
  data: T;
}

/**
 * Message object indicating an error.
 */
export interface ErrorMessage extends Message {}

/**
 * Message object.
 */
export interface Message {
  /**
   * The message to be included in the response.
   */
  message: string;
  /**
   * The status code of the response.
   */
  status: number;
}
