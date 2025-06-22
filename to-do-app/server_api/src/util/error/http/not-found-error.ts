import {HttpError} from "./http-error.js";

/**
 * Error class for a 404 Not Found error.
 */
export class NotFoundError extends HttpError {
  /**
   * Constructor for NotFoundError.
   * @param message An error message.
   */
  public constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}
