import {JSONObject} from "../../util/json/json.js";
import {CreateTodo} from "../dto/create-todo.js";
import {ParseError} from "../../util/parser/parse-error.js";
import {Strings} from "../../util/parser/strings.js";
import {Dates} from "../../util/parser/dates.js";
import {UpdateTodo} from "../dto/update-todo.js";
import {TodoStatusParser} from "./todo-status-parser.js";

const TODO_VALIDATION_MESSAGE = 'Todo is required as a JSON object.';
const TITLE_VALIDATION_MESSAGE = 'Title is required as a string with at least 3 characters.';
const DESCRIPTION_VALIDATION_MESSAGE = 'Description is required as a string.';
const DUE_DATE_VALIDATION_MESSAGE = 'Due date is required as a valid ISO date string.';
const STATUS_VALIDATION_MESSAGE = 'Status is required as a string of either {open | done}.';

/**
 * Utility class for parsing and validating to-do DTOs.
 */
export class TodoDtoParser {
  /**
   * Parses a JSON object to a CreateTodo object.
   *
   * @param value The JSON object to parse
   *
   * @throws {ParseError} If the value cannot be parsed to a valid CreateTodo object.
   *
   * @returns The parsed CreateTodo object
   */
  public static parseCreateTodo(value: JSONObject | undefined): CreateTodo {
    if (!value) {
      throw new ParseError(TODO_VALIDATION_MESSAGE);
    }

    // parse required information for a todo creation
    const title = Strings.parse(value.title, TITLE_VALIDATION_MESSAGE);
    const description = Strings.parse(value.description, DESCRIPTION_VALIDATION_MESSAGE);
    const dueDate = Dates.parseISODateOptional(value.dueDate, DUE_DATE_VALIDATION_MESSAGE);

    // validate information for a todo creation
    if (title.trim().length < 3) {
      throw new ParseError(TITLE_VALIDATION_MESSAGE);
    }

    return {
      title: title,
      description: description,
      dueDate: dueDate
    }
  }

  /**
   * Parses a JSON object to a UpdateTodo object.
   *
   * @param body The JSON object to parse
   *
   * @throws {ParseError} If the value cannot be parsed to a valid UpdateTodo object.
   *
   * @returns The parsed UpdateTodo object
   */
  public static parseUpdateTodo(body: JSONObject | undefined): UpdateTodo {
    if (!body) {
      throw new ParseError(TODO_VALIDATION_MESSAGE);
    }

    // parse required information for a to-do update
    const title = Strings.parse(body.title, TITLE_VALIDATION_MESSAGE);
    const description = Strings.parse(body.description, DESCRIPTION_VALIDATION_MESSAGE);
    const status = TodoStatusParser.parse(body.status, STATUS_VALIDATION_MESSAGE);
    const dueDate = Dates.parseISODateOptional(body.dueDate);

    // validate information for a to-do update
    if (title.trim().length < 3) {
      throw new ParseError(TITLE_VALIDATION_MESSAGE);
    }

    return {
      title: title,
      description: description,
      status: status,
      dueDate: dueDate
    }
  }
}
