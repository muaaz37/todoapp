import {ParseError} from "../../util/parser/parse-error.js";
import {TodoStatus} from "../model/todo.js";

const VALID_STATUSES = Object.values(TodoStatus).map(status => status.toLowerCase());
const STATUS_VALIDATION_MESSAGE = `Status is required as a string of either {${VALID_STATUSES.join(' | ')}!}`;

/**
 * Parser for the status of a to-do item.
 */
export class TodoStatusParser {
  /**
   * Parses the status of a to-do item.
   * @param status - The status to parse.
   * @param errorMessage - The error message to throw if the status is invalid.
   * @throws ParseError If the status is invalid.
   * @returns The parsed status.
   */
  public static parse(status: unknown, errorMessage: string = STATUS_VALIDATION_MESSAGE): TodoStatus {
    const parsedStatus = TodoStatusParser.parseOptional(status);

    if (!parsedStatus) {
      throw new ParseError(errorMessage);
    }

    return parsedStatus;
  }

  /**
   * Parses the status of a to-do item, if it is provided.
   * @param status - The status to parse.
   * @param errorMessage - The error message to throw if the status is invalid.
   * @throws ParseError If the status is invalid.
   * @returns The parsed status or undefined if not provided.
   */
  public static parseOptional(status: unknown, errorMessage: string = STATUS_VALIDATION_MESSAGE): TodoStatus | undefined {
    if (!status) {
      return undefined;
    }

    if (typeof status !== 'string') {
      throw new ParseError(errorMessage);
    }

    if (!Object.values(TodoStatus).includes(status as TodoStatus)) {
      throw new ParseError(errorMessage);
    }

    return status as TodoStatus;
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}




