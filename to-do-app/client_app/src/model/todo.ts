/**
 * To-item definition
 */
export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  dueDate?: Date;
}

/**
 * Data Transfer Object (DTO) for creating a new to-do item.
 */
export interface NewTodo {
  title: string;
  description: string;
  dueDate?: Date;
}

/**
 * Status of a to-do item.
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
