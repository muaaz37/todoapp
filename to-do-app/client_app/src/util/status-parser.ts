import {TodoStatus} from "../model/todo.js";

/**
 * TodoStatusParser is a utility class that provides methods to parse and convert.
 */
export class TodoStatusParser {

  /**
   * Parses the status of a to-do item.
   * @param status - The status to parse.
   * @returns The parsed status or undefined if not valid.
   */
  public static parse(status: string): TodoStatus | undefined {
    switch (status.toLowerCase()) {
      case 'open':
        return TodoStatus.OPEN;
      case 'done':
        return TodoStatus.DONE;
      default:
        return undefined;
    }
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}
