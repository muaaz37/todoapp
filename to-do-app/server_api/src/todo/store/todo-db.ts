import {TodoFilterOptions} from "../model/todo-filter-options.js";
import {TodoSortOptions} from "../model/todo-sort-options.js";
import {Todo} from "../model/todo.js";
import {UUID} from "../../util/identity/id.js";

/**
 * Database for managing to-do items.
 */
export interface TodoDb {
  /**
   * Retrieves all to-do items based on the provided filter and sorting options.
   * @param filter - The filter criteria for retrieving to-do items.
   * @param order - The sorting options for the retrieved to-do items.
   * @returns An array of to-do items that match the filter and sorting criteria.
   */
  getAll(filter: TodoFilterOptions, order: TodoSortOptions): Promise<Todo[]>;

  /**
   * Retrieves a to-do item by its ID.
   * @param id - The ID of the to-do item to retrieve.
   * @returns The to-do item with the specified ID, or undefined if not found.
   */
  get(id: UUID): Promise<Todo | undefined>;

  /**
   * Creates a new to-do item.
   * @param todo - The to-do item to create.
   * @returns The created to-do item.
   */
  create(todo: Todo): Promise<Todo>;

  /**
   * Updates an existing to-do item by its ID.
   * @param todo - The to-do item to update.
   * @returns The updated to-do item, or undefined if not found.
   */
  update(todo: Todo): Promise<Todo | undefined>;

  /**
   * Removes a to-do item by its ID.
   * @param id - The ID of the to-do item to remove.
   * @returns The removed to-do item, or undefined if not found.
   */
  remove(id: UUID): Promise<Todo | undefined>;
}
