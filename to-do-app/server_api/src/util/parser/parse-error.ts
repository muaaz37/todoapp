import {ValidationError} from "./validation-error.js";

/**
 * Represents an error that occurs during parsing.
 */
export class ParseError extends ValidationError {
  /**
   * Constructor for ParseError.
   * @param message An error message.
   */
  public constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}
