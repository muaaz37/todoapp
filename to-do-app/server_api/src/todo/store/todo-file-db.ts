import {TodoSortOptions} from "../model/todo-sort-options.js";
import {TodoFilterOptions} from "../model/todo-filter-options.js";
import {JSONFilePreset} from 'lowdb/node'
import {Low} from "lowdb";
import {TodoDb} from './todo-db.js';
import {Todo, TodoStatus} from "../model/todo.js";
import {UUID} from "../../util/identity/id.js";
import {TodoSortAttributes} from "../model/todo-sort-attributes.js";
import {TodoStatusParser} from "../parser/todo-status-parser.js";
import {Dates} from "../../util/parser/dates.js";
import {Order} from "../model/order.js";

type Data = {
  todos: Todo[]
}

/**
 * File-based database for managing to-do items.
 *
 */
export class TodoFileDb implements TodoDb {

  private readonly db: Promise<Low<Data>>;

  /**
   * Creates an instance of the TodoFileDb class.
   * @param dbFilePath - The file path for the database file.
   */
  public constructor(private dbFilePath: string) {
    this.db = JSONFilePreset<Data>(this.dbFilePath, {
      todos: []
    });
  }

  public async getAll(filter: TodoFilterOptions, order: TodoSortOptions): Promise<Todo[]> {
    const db = await this.db;

    return db.data.todos
      .map(this.normalizeTodo)
      .filter(this.todoFilter(filter))
      .sort(this.todoComparator(order));
  }

  public async get(id: UUID): Promise<Todo | undefined> {
    const db = await this.db;

    return db.data.todos.map(this.normalizeTodo).find(todo => todo.id === id);
  }

  public async create(todo: Todo): Promise<Todo> {
    const db = await this.db;
    await db.update((data: Data) => data.todos.push(todo))

    return todo;
  }

  public async update(todo: Todo): Promise<Todo | undefined> {
    const db = await this.db;
    const todos = db.data.todos;

    let index = todos.findIndex(t => t.id === todo.id);
    if (index === -1) {
      return undefined;
    }

    await db.update((data: Data) => data.todos[index] = todo);

    return todo;
  }

  public async remove(id: UUID): Promise<Todo | undefined> {
    const db = await this.db;
    const todos = db.data.todos;

    let index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      return undefined;
    }

    const todo = todos[index];
    await db.update((data: Data) => data.todos.splice(index, 1));

    return this.normalizeTodo(todo);
  }

  private todoComparator(order: TodoSortOptions): (a: Todo, b: Todo) => number {
    let orderFactor = order.order === Order.ASC ? 1 : -1;

    switch (order.sortBy) {
      case TodoSortAttributes.TITLE:
        return (a, b) => {
          return orderFactor * a.title.localeCompare(b.title);
        }

      case TodoSortAttributes.STATUS:
        return (a, b) => {
          const aValue = a.status === TodoStatus.OPEN ? 0 : 1;
          const bValue = b.status === TodoStatus.OPEN ? 0 : 1;
          return orderFactor * (aValue - bValue);
        }

      case TodoSortAttributes.DUE_DATE:
        return (a, b) => {
          const aDate = a.dueDate ? a.dueDate.getTime() : Number.MAX_SAFE_INTEGER;
          const bDate = b.dueDate ? b.dueDate.getTime() : Number.MAX_SAFE_INTEGER;

          return orderFactor * (aDate - bDate);
        }

      default: // TodoSortAttributes.CREATED_AT
        return (a, b) => {
          return orderFactor * (a.createdAt.getTime() - b.createdAt.getTime());
        }
    }
  }

  private todoFilter(filter: TodoFilterOptions) {
    return (todo: Todo) => {
      if (filter.title && !todo.title.toLowerCase().includes(filter.title.toLowerCase())) {
        return false;
      }

      return !(filter.status && todo.status !== filter.status);
    }
  }

  private normalizeTodo(todo: Todo): Todo {
    return {
      ...todo,
      status: TodoStatusParser.parse(todo.status),
      createdAt: Dates.parseISODate(todo.createdAt),
      dueDate: Dates.parseISODateOptional(todo.dueDate),
    }
  }
}
