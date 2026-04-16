import {UUID} from "../../util/identity/id.js";

/**
 * Interface representing a to-do item.
 */
export interface Todo {
  /**
   * The unique identifier of the to-do item.
   */
  id: UUID;

  /**
   * The title of the to-do item.
   */
  title: string;

  /**
   * The description of the to-do item.
   */
  description: string;

  /**
   * The status of the to-do item.
   */
  status?: TodoStatus;

  /**
   * The creation date of the to-do item.
   */
  createdAt: Date;

  /**
   * The due date of the to-do item.
   */
  dueDate?: Date;
}

/**
 * Enum representing the status of a to-do item.
 * This enum is used to indicate whether a to-do is open or completed.
 *
 * @enum {string}
 */
export enum TodoStatus {
  /**
   * Indicates that the to-do item is open, i.e., the to-do is not completed.
   */
  OPEN = 'open',

  /**
   * Indicates that the to-do item is done, i.e., the to-do is completed.
   */
  DONE = 'done',
}
