import {ParseError} from "./parse-error.js";
import {ValidationError} from "./validation-error.js";

/**
 * Utility class for parsing and validating string values.
 */
export class Strings {
  /**
   * Parses a value to a string, if the value is a valid string.
   *
   * @param value The value to parse
   * @param errorMessage The error message to throw if the value is not a string
   * @throws {ParseError} If the value is not a string
   * @returns The parsed string value
   */
  public static parse(value: unknown, errorMessage: string = 'Value is not a string!'): string {
    if (value === undefined || value === null) {
      throw new ParseError(errorMessage);
    }

    if (typeof value !== 'string') {
      throw new ParseError(errorMessage);
    }

    return value;
  }

  /**
   * Tries to parse a value to a string, if the value is a valid string.
   * If the value is not a string, it returns undefined.
   *
   * @param value The value to parse
   * @return The parsed string value or undefined
   */
  public static parseOptional(value: unknown): string | undefined {
    try {
      return Strings.parse(value);
    } catch (e: unknown) {
      return undefined;
    }
  }

  /**
   * Checks if a string is empty, null or undefined.
   *
   * @param value The string to check
   * @throws {ValidationError} If the string is empty, null or undefined
   */
  public static requireNotEmpty(value?: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Value is required and cannot be empty!');
    }
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}
