import {TodoFilterOptions} from "../model/todo-filter-options.js";
import {RequestQuery} from "../../util/api/request-handler.js";
import {Strings} from "../../util/parser/strings.js";
import {TodoStatusParser} from "./todo-status-parser.js";

/**
 * Parser for filtering options of todos.
 */
export class TodoFilterOptionsParser {
  /**
   * Parses the filtering options from the request query.
   * @param query - The request query containing filtering options.
   * @returns An instance of TodoFilterOptions containing the parsed filtering options.
   */
  public static parse(query: RequestQuery): TodoFilterOptions {
    return new TodoFilterOptions(
      Strings.parseOptional(query.title),
      TodoStatusParser.parseOptional(query.status),
    );
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}


