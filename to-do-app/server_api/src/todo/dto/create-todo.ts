/**
 * Data Transfer Object (DTO) for creating a new to-do item.
 */
export interface CreateTodo {
  title: string;
  description: string;
  dueDate?: Date;
}
