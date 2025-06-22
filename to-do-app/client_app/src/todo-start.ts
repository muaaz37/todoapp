// Diese Datei ist dafür da, die UI mit der Logik zu verbinden bedeutet, dass sie die
// UI-Elemente mit den entsprechenden Funktionen verbindet. zum Beispeil erstellung einer
// Insatnz von message Manger um fehlern abzufangen
// Benutzerinteraktionen (z. B. Erstellen, Bearbeiten, Löschen von To-Dos) regeln
import {TodoTableManager} from "./ui/todo-table-manager.js";
import {TodoService} from "./service/todo-service.js";
import {MessageManager} from "./ui/message-manager.js";
import {TodoModalDialog} from "./ui/todo-modal-dialog.js";
import {TodoOrder} from "./model/todo-order.js";
import {TodoFilter} from "./model/todo-filter.js";

document.addEventListener("DOMContentLoaded", () => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    window.location.href = "/authForm.html";
  }
});


  const BASE_API_URL = 'http://localhost:8081';

  const messageContainer = document.querySelector('.message-container') as HTMLElement;
  const todoTableContainer = document.querySelector('.todo-table-container') as HTMLElement;

  const todoService = new TodoService(BASE_API_URL);

  const messageManager = new MessageManager(messageContainer);

  const todoTableManager = TodoTableManager.render(todoTableContainer, async (filter, order) => {
    await refreshTodos(filter, order);
  });

  const refreshTodos = async (filter: TodoFilter, order: TodoOrder) => {
    await todoTableManager.clear();
    const todos = await todoService.getAll(filter, order);
    await todoTableManager.addAll(
      todos,
      async (todo) => {
        TodoModalDialog.openEdit(
          todo,
          async (todo) => {
            try {
              await todoService.update(todo);
              await refreshTodos(filter, order);
            } catch (error) {
              messageManager.showError(error);
            }
          }
        );
      },
      async (todo) => {
        try {
          await todoService.delete(todo);
          await refreshTodos(filter, order);
        } catch (error) {
          messageManager.showError(error);
        }
      },
      async (todo) => {
        try {
          await todoService.updateStatus(todo);
          await refreshTodos(filter, order);
        } catch (error) {
          messageManager.showError(error);
        }
      }
    );
  }

  const newTodoButton = document.querySelector('.btn-new-todo') as HTMLButtonElement;

  newTodoButton.addEventListener('click', () => {
    TodoModalDialog.open(
      async (todo) => {
        try {
          await todoService.create(todo);
          await refreshTodos(todoTableManager.getFilter(), todoTableManager.getOrder());
        } catch (error) {
          messageManager.showError(error);
        }
      }
    )
  });

// Initial load of todos
  refreshTodos(todoTableManager.getFilter(), todoTableManager.getOrder());

