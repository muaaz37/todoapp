/**
 * Represents a validation error occurring during checking expected inputs.
 */
export class ValidationError extends Error {
  /**
   * Constructor for ValidationError.
   * @param message An error message.
   */
  public constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
