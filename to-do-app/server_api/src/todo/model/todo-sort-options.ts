import {TodoSortAttributes} from "./todo-sort-attributes.js";
import {Order} from "./order.js";

/**
 * Represents the sorting options for todos.
 */
export class TodoSortOptions {
  /**
   * Creates an instance of TodoSortOptions.
   * @param sortBy - The attribute to sort by.
   * @param order - The order of sorting (ascending or descending).
   */
  public constructor(
    public readonly sortBy: TodoSortAttributes,
    public readonly order: Order
  ) {}
}
