import {Express} from "express";
import {TodoService} from "todo/service/todo-service.js";
import {RequestHandler, Respond} from "../../util/api/request-handler.js";
import {TodoFilterOptionsParser} from "../parser/todo-filter-options-parser.js";
import {TodoSortOptions} from "../model/todo-sort-options.js";
import {TodoSortOptionsParser} from "../parser/todo-sort-options-parser.js";
import {UUIDParser} from "../../util/parser/uuid-parser.js";
import {NotFoundError} from "../../util/error/http/not-found-error.js";
import {TodoDtoParser} from "../parser/todo-dto-parser.js";
import {TodoStatusParser} from "../parser/todo-status-parser.js";

const INVALID_TODO_ID_MESSAGE = 'Todo ID must be a hex encoded UUID v4 string';
const TODO_NOT_FOUND_MESSAGE = 'Todo not found';

const memoryHog = []; // Array to store memory allocations

/**
 * A class that handles the API for managing to-do items.
 */
export class TodoApi {

  /**
   * Creates an instance of the TodoApi class.
   * @param todoService - The service for managing to-do items.
   */
  public constructor(private readonly todoService: TodoService) {}

  /**
   * Appends the routing for the to-do API to the provided Express application.
   * @param app - The Express application to which the routing will be appended.
   */
  public appendRouting(app: Express): void {
    app.get('/todos', this.getAllTodos);
    app.get('/todos/:id', this.getTodoById);
    app.post('/todos', this.createTodo);
    app.put('/todos/:id', this.updateTodo);
    app.patch('/todos/:id/status', this.updateTodoStatus);
    app.delete('/todos/:id', this.deleteTodo);

    // Add a route for memory stress
    app.get('/stress-memory', (req, res) => {
      try {
        const allocation = new Array(20 * 1024 * 1024).fill('X'); // Allocate ~40 MB of memory
        memoryHog.push(allocation); // Accumulate memory in global array
        res.send('Memory allocated. Current size: ' + memoryHog.length * 40 + ' MB');
      } catch (error) {
        res.status(500).send('Memory limit reached or an error occurred!');
      }
    });

  }

  private getAllTodos = RequestHandler.handle(async (req) => {
    const filter = TodoFilterOptionsParser.parse(req.query);
    const order: TodoSortOptions = TodoSortOptionsParser.parse(req.query)

    let todos = await this.todoService.getAll(filter, order);

    return Respond.ok(todos);
  });

  private getTodoById = RequestHandler.handle(async (req) => {
      const todoId = UUIDParser.parse(req.params.id, INVALID_TODO_ID_MESSAGE);

      const todo = await this.todoService.get(todoId);

      if (!todo) {
        throw new NotFoundError(TODO_NOT_FOUND_MESSAGE);
      }

      return Respond.ok(todo);
  });

  private createTodo = RequestHandler.handle(async (req) => {
      const todo = TodoDtoParser.parseCreateTodo(req.body);

      const createdTodo = await this.todoService.create(todo);

      return Respond.created(createdTodo);
  });

  private updateTodo = RequestHandler.handle(async (req) => {
    const todoId = UUIDParser.parse(req.params.id, INVALID_TODO_ID_MESSAGE);
    const todo = TodoDtoParser.parseUpdateTodo(req.body);

    const updatedTodo = await this.todoService.update(todoId, todo);

    if (!updatedTodo) {
      throw new NotFoundError(TODO_NOT_FOUND_MESSAGE);
    }

    return Respond.ok(updatedTodo);
  });

  private updateTodoStatus = RequestHandler.handle(async (req) => {
    const todoId = UUIDParser.parse(req.params.id, INVALID_TODO_ID_MESSAGE);
    const status = TodoStatusParser.parse(req.body.status);

    const updatedTodo = await this.todoService.updateStatus(todoId, status);

    if (!updatedTodo) {
      throw new NotFoundError(TODO_NOT_FOUND_MESSAGE);
    }

    return Respond.ok(updatedTodo);
  });

  private deleteTodo = RequestHandler.handle(async (req) => {
    const todoId = UUIDParser.parse(req.params.id, INVALID_TODO_ID_MESSAGE);

    const deletedTodo = await this.todoService.remove(todoId);

    if (!deletedTodo) {
      throw new NotFoundError(TODO_NOT_FOUND_MESSAGE);
    }

    return Respond.ok(deletedTodo);
  });
}
