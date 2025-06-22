import {ParseError} from "./parse-error.js";
import {Strings} from "./strings.js";

const ISO_DATE_VALIDATION_MESSAGE = 'Value is not a valid ISO date string!';

/**
 * Utility class for parsing and validating date values.
 */
export class Dates {

  /**
   * Parses a value to a date, depending on the input:
   * - If the value is an ISO date string, it tries to parse it as an ISO date string.
   * - If the value is undefined or null, it returns undefined.
   * - If the value cannot be parsed to a date, it throws an error.
   *
   * @param value The value to parse
   * @param errorMessage The error message to throw if the value is not a valid ISO date string
   * @throws {Error} If the value is not a valid ISO date string
   * @return The parsed date value
   */
  public static parseISODateOptional(value: unknown, errorMessage: string = ISO_DATE_VALIDATION_MESSAGE): Date | undefined {
    if (!value) {
      return undefined;
    }

    return Dates.parseISODate(value, errorMessage);
  }

  /**
   * Parses a value to a date, depending on the input:
   * - If the value is an ISO date string, it tries to parse it as an ISO date string.
   * - If the value cannot be parsed to a date, it throws an error.
   *
   * @param value The value to parse
   * @param errorMessage The error message to throw if the value is not a valid ISO date string
   * @throws {Error} If the value is not a valid ISO date string
   * @return The parsed date value
   */
  public static parseISODate(value: unknown, errorMessage: string = ISO_DATE_VALIDATION_MESSAGE): Date {
    if (value === undefined || value === null) {
      throw new ParseError(errorMessage);
    }

    if (value instanceof Date) {
      return value;
    }

    const stringDate = Strings.parse(value);
    const date = new Date(stringDate);

    if (isNaN(date.getTime())) {
      throw new ParseError(errorMessage);
    }

    return date;
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}
