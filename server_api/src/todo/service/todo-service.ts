/**
 * Kümmert sich um die Todo-Logik alle CRUD Operationen werden hier implementiert und sie kümmert sich
 * dass die Datenbank richtig angesprochen wird. Sie ist die Schnittstelle zwischen der API und der DB.
 */
import { UUIDGenerator } from "../../util/identity/uuid-generator.js";
import { UpdateTodo } from "../dto/update-todo.js";
import { Todo, TodoStatus} from "../model/todo.js";
import {TodoDb} from "../store/todo-db.js";
import {TodoFilterOptions} from "../model/todo-filter-options.js";
import {TodoSortOptions} from "../model/todo-sort-options.js";
import {UUID} from "../../util/identity/id.js";
import {CreateTodo} from "../dto/create-todo.js";

/**
 * A class that provides services for managing to-do items.
 */
export class TodoService {

  /**
   * Creates an instance of the TodoService class.
   * @param todoDb - The database for managing to-do items.
   */
  public constructor(
    private readonly todoDb: TodoDb,
  ) {}

  /**
   * Retrieves all to-do items based on the provided filter and sorting options.
   * @param filter - The filter criteria for retrieving to-do items.
   * @param order - The sorting options for the retrieved to-do items.
   *
   * @returns An array of to-do items that match the filter and sorting criteria.
   */
  public async getAll(filter: TodoFilterOptions, order: TodoSortOptions): Promise<Todo[]> {
    return this.todoDb.getAll(filter, order);
  }

  /**
   * Retrieves a to-do item by its ID.
   *
   * @param id - The ID of the to-do item to retrieve.
   *
   * @returns The to-do item with the specified ID, or undefined if not found.
   */
  public async get(id: UUID): Promise<Todo | undefined> {
    return this.todoDb.get(id);
  }

  /**
   * Creates a new to-do item.
   *
   * @param todo - The to-do item to create.
   *
   * @returns The created to-do item.
   */
  public async create(todo: CreateTodo): Promise<Todo> {
    const todoToCreate: Todo = {
      id: UUIDGenerator.generate(),
      title: todo.title,
      description: todo.description,
      status: TodoStatus.OPEN,
      createdAt: new Date(),
      dueDate: todo.dueDate,
    };

    return this.todoDb.create(todoToCreate);
  }

  /**
   * Updates the status of an existing to-do item by its ID.
   *
   * @param id - The ID of the to-do item to update.
   * @param todo - The updated to-do item.
   *
   * @returns The updated to-do item, or undefined if not found.
   */
  public async update(id: UUID, todo: UpdateTodo): Promise<Todo | undefined> {
    const existingTodo = await this.todoDb.get(id);
    if (!existingTodo) {
      return undefined;
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      dueDate: todo.dueDate,
    };

    return this.todoDb.update(updatedTodo);
  }

  /**
   * Updates the status of an existing to-do item by its ID.
   *
   * @param id - The ID of the to-do item to update.
   * @param status - The new status of the to-do item.
   *
   * @returns The updated to-do item, or undefined if not found.
   */
  public async updateStatus(id: UUID, status: TodoStatus): Promise<Todo | undefined> {
    const existingTodo = await this.todoDb.get(id);
    if (!existingTodo) {
      return undefined;
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      status: status,
    };

    return this.todoDb.update(updatedTodo);
  }

  /**
   * Removes a to-do item by its ID.
   * @param id - The ID of the to-do item to remove.
   *
   * @returns The removed to-do item, or undefined if not found.
   */
  public async remove(id: UUID): Promise<Todo | undefined> {
    return this.todoDb.remove(id);
  }
}
