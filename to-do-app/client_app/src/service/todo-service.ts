import { NewTodo, Todo } from "../model/todo.js";
import { TodoFilter } from "../model/todo-filter.js";
import { TodoOrder } from "../model/todo-order.js";

/**
 * Service to manage to-do items.
 */
export class TodoService {
  /**
   * Creates a new instance of the TodoService.
   * @param apiUrl The base URL of a to-do API.
   */
  public constructor(private apiUrl: string) {
    console.log(`TodoService initialized with API URL: ${this.apiUrl}`);
  }

  /**
   * Returns headers with JWT Authorization and optional additional headers.
   */
  private getAuthHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
    const token = localStorage.getItem("jwt");
    const type = localStorage.getItem("jwt_type") || "Bearer";
    return {
      'Authorization': `${type} ${token}`,
      ...additionalHeaders
    };
  }

  /**
   * Fetches all to-do items.
   * @param filter The filter options to apply to the to-do items.
   * @param order The order options to apply to the to-do items.
   *
   * @returns A promise that resolves to an array of to-do items.
   */
  public async getAll(
    filter: TodoFilter,
    order: TodoOrder,
  ): Promise<Todo[]> {
    let todosUrl = `${this.apiUrl}/todos?sort=${order.attribute}&order=${order.order}`

    // add filter parameters
    if (filter.title) {
      todosUrl += `&title=${filter.title}`;
    }
    if (filter.status) {
      todosUrl += `&status=${filter.status}`;
    }

    console.log(todosUrl);
    const response = await fetch(todosUrl, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorMessage = await response.json() as ErrorMessage;
      throw new Error(errorMessage.message);
    }

    const data = await response.json() as DataMessage<Todo[]>;

    return data.data.map(this.normalize);
  }

  /**
   * Fetches a to-do item by its ID.
   * @param id The ID of the to-do item to fetch.
   *
   * @returns A promise that resolves to the to-do item with the specified ID.
   */
  public async getById(id: number): Promise<Todo> {
    const response = await fetch(`${this.apiUrl}/todos/${id}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorMessage = await response.json() as ErrorMessage;
      throw new Error(errorMessage.message);
    }

    const data = await response.json() as DataMessage<Todo>;

    return this.normalize(data.data);
  }

  /**
   * Creates a new to-do item.
   * @param todo The to-do item to create.
   *
   * @returns A promise that resolves to the created to-do item.
   */
  public async create(todo: NewTodo): Promise<Todo> {
    const response = await fetch(`${this.apiUrl}/todos`, {
      method: 'POST',
      mode: 'cors',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(todo)
    });

    if (!response.ok) {
      const errorMessage = await response.json() as ErrorMessage;
      throw new Error(errorMessage.message);
    }

    const data = await response.json() as DataMessage<Todo>;

    return this.normalize(data.data);
  }

  /**
   * Updates an existing to-do item.
   * @param todo The to-do item to update.
   *
   * @returns A promise that resolves to the updated to-do item.
   */
  public async update(todo: Todo): Promise<Todo> {
    const response = await fetch(`${this.apiUrl}/todos/${todo.id}`, {
      method: 'PUT',
      mode: 'cors',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(todo)
    });

    if (!response.ok) {
      const errorMessage = await response.json() as ErrorMessage;
      throw new Error(errorMessage.message);
    }

    const data = await response.json() as DataMessage<Todo>;

    return this.normalize(data.data);
  }

  /**
   * Updates the status of an existing to-do item.
   * @param todo The to-do item to update.
   *
   * @returns A promise that resolves to the updated to-do item.
   */
  public async updateStatus(todo: Todo): Promise<Todo> {
    return this.updateStatusById(todo.id, todo.status);
  }

  /**
   * Updates the status of an existing to-do item by its ID.
   * @param id The ID of the to-do item to update.
   * @param status The new status of the to-do item.
   *
   * @returns A promise that resolves to the updated to-do item.
   */
  public async updateStatusById(id: string, status: string): Promise<Todo> {
    const response = await fetch(`${this.apiUrl}/todos/${id}/status`, {
      method: 'PATCH',
      mode: 'cors',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorMessage = await response.json() as ErrorMessage;
      throw new Error(errorMessage.message);
    }

    const data = await response.json() as DataMessage<Todo>;

    return this.normalize(data.data);
  }

  /**
   * Deletes a to-do item by its ID.
   * @param todo The to-do item to delete.
   *
   * @returns A promise that resolves when the to-do item is deleted.
   */
  public async delete(todo: Todo): Promise<void> {
    await this.deleteById(todo.id);
  }

  /**
   * Deletes a to-do item by its ID.
   * @param id The ID of the to-do item to delete.
   *
   * @returns A promise that resolves when the to-do item is deleted.
   */
  public async deleteById(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/todos/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorMessage = await response.json() as ErrorMessage;
      throw new Error(errorMessage.message);
    }
  }

  /**
   * Normalizes a to-do item by converting date strings to Date objects.
   * @param todo The to-do item to normalize.
   *
   * @returns The normalized to-do item.
   */
  private normalize(todo: Todo): Todo {
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
    }
  }
}

/**
 * Interface representing the structure of an error message.
 */
interface ErrorMessage {
  message: string;
  status: number;
}

/**
 * Interface representing the structure of a data message.
 */
interface DataMessage<T> {
  data: T;
  message: string;
  status: number;
}
