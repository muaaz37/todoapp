import {ParseError} from "./parse-error.js";

const VALIDATION_MESSAGE = 'Value is not an integer!';

/**
 * A utility class for parsing numbers.
 */
export class Numbers {

  /**
   * Parses a string to an integer.
   *
   * @param value The value to parse
   * @param errorMessage The error message to throw if the value is not a valid integer
   * @throws ParseError If the value is not a valid integer
   * @return The parsed integer value
   */
  public static parseInt(value: unknown, errorMessage: string = VALIDATION_MESSAGE): number {
    if (value === undefined || value === null) {
      throw new ParseError(errorMessage);
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsedValue = Number.parseInt(value);

      if (Number.isNaN(parsedValue)) {
        throw new ParseError(errorMessage);
      }

      return parsedValue;
    }

    throw new ParseError(errorMessage);
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}
