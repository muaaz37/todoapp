import {TodoStatus} from "./todo.js";

/**
 * TodoFilterOptions is a class that represents the filter options for a to-do item.
 */
export class TodoFilterOptions {
  /**
   * Creates an instance of TodoFilterOptions.
   * @param title Title filter for a to-do item, matches if included in the title of a to-do item.
   * @param status Status filter for a to-do item, matches if the status of a to-do item is equal to the provided status.
   */
  public constructor(
    public readonly title: string | undefined = undefined,
    public readonly status: TodoStatus | undefined = undefined,
  ) {}
}
