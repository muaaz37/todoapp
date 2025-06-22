import {HttpError} from "./http-error.js";

/**
 * Error class for a 400 Bad Request error.
 */
export class BadRequestError extends HttpError {
  /**
   * Constructor for BadRequestError.
   * @param message An error message.
   */
  public constructor(message: string) {
    super(400, message);
    this.name = 'BadRequestError';
  }
}
