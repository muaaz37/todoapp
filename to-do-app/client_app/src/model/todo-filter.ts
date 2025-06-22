import {TodoStatus} from "./todo.js";

/**
 * Specifies a filter options that a to-do item must match to be included in a result set.
 */
export class TodoFilter {
  /**
   * Filter options for a to-do item to filter by title and status.
   * @param title The title that should be included in the to-do item title (case_insensitive).
   * @param status The status that should be equal to the to-do item status.
   */
  public constructor(
    public readonly title: string | undefined = undefined,
    public readonly status: TodoStatus | undefined = undefined,
  ) {}
}
