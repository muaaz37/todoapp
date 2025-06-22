import { TodoSortAttribute } from "./todo-sort-attribute.js";
import { SortOrder } from "./sort-order.js";
/**
 * Specifies the order in which to sort a collection of to-do items.
 */
export class TodoOrder {
    attribute;
    order;
    constructor(attribute = TodoSortAttribute.CREATED_AT, order = SortOrder.DESC) {
        this.attribute = attribute;
        this.order = order;
    }
}
