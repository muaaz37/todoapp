import {TodoSortAttribute} from "./todo-sort-attribute.js";
import {SortOrder} from "./sort-order.js";

/**
 * Specifies the order in which to sort a collection of to-do items.
 */
export class TodoOrder {
  public constructor(
    public readonly attribute = TodoSortAttribute.CREATED_AT,
    public readonly order = SortOrder.DESC
  ) {}
}
