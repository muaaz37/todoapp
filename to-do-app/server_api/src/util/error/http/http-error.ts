/**
 * Error class for a generic HTTP error.
 * Includes a http status code and a message.
 */
export class HttpError extends Error {
  private readonly statusCode: number;

  /**
   * Constructor for HttpError.
   * @param statusCode An HTTP status code.
   * @param message An error message.
   */
  public constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }

  public get status(): number {
    return this.statusCode;
  }
}
