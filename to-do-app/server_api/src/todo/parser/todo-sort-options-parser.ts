import {TodoSortOptions} from "../model/todo-sort-options.js";
import {RequestQuery} from "../../util/api/request-handler.js";
import {Order} from "../model/order.js";
import {ParseError} from "../../util/parser/parse-error.js";
import {TodoSortAttributes} from "../model/todo-sort-attributes.js";

/**
 * Parser for sort options of todos.
 */
export class TodoSortOptionsParser {
  /**
   * Parses the sort options from the request query.
   * @param query - The request query containing sort options.
   *
   * @throws ParseError If the sort options are invalid.
   * @returns An instance of TodoSortOptions containing the parsed sort options.
   */
  public static parse(query: RequestQuery): TodoSortOptions {
    return new TodoSortOptions(
      SortOptionsParser.parse(query.sort),
      OrderOptionsParser.parse(query.order)
    );
  }
  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}

const VALID_ORDER_VALUES = Object.values(Order).map(order => order.toLowerCase());
const ORDER_VALIDATION_MESSAGE = `Order value is required as a string of either {${VALID_ORDER_VALUES.join(' | ')}!}`;

/**
 * Parser for the order of todos.
 */
class OrderOptionsParser {
  /**
   * Parses the order of todos.
   *
   * @param order - The order to parse.
   * @throws ParseError If the order is invalid.
   * @returns The parsed order.
   */
  public static parse(order: unknown): Order {
    if (!order) {
      return Order.ASC;
    }

    if (typeof order !== 'string') {
      throw new ParseError(ORDER_VALIDATION_MESSAGE);
    }

    if (!Object.values(Order).includes(order as Order)) {
      throw new ParseError(ORDER_VALIDATION_MESSAGE);
    }

    return order as Order;
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}

const VALID_SORT_ATTRIBUTES = Object.values(TodoSortAttributes).map(attr => attr.toLowerCase());
const SORT_VALIDATION_MESSAGE = `Sort attribute is required as a string of either {${VALID_SORT_ATTRIBUTES.join(' | ')}!}`;

/**
 * Parser for the sort attributes of todos.
 */
class SortOptionsParser {
  /**
   * Parses the sort attribute of todos.
   *
   * @param sortBy - The sort attribute to parse.
   * @throws ParseError If the sort attribute is invalid.
   * @returns The parsed sort attribute.
   */
  public static parse(sortBy: unknown): TodoSortAttributes {
    if (!sortBy) {
      return TodoSortAttributes.CREATED_AT;
    }

    if (typeof sortBy !== 'string') {
      throw new ParseError(SORT_VALIDATION_MESSAGE);
    }

    if (!Object.values(TodoSortAttributes).includes(sortBy as TodoSortAttributes)) {
      throw new ParseError(SORT_VALIDATION_MESSAGE);
    }

    return sortBy as TodoSortAttributes;
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}
