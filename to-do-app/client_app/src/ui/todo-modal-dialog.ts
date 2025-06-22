import {NewTodo, Todo} from "../model/todo.js";

declare var bootstrap: any;

/**
 * UI component for a modal dialog to create or edit a to-do item.
 */
export class TodoModalDialog {
  private static template = `
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">Todo</h5>
        </div>
        <div class="modal-body">
          <div class="modal-body">
            <div class="input-group flex-column">
              <div>
                <label for="todo-title">Title*</label>
                <input id="todo-title" type="text" class="form-control mb-2" aria-label="Todo Name Input">
              </div>
              <div>
                <label for="todo-description">Description (optional)</label>
                <input id="todo-description" type="text" class="form-control mb-2" aria-label="Todo description Input">
              </div>
              <div>
                <label for="todo-dueDate">Due date (optional)</label>
                <input id="todo-dueDate" type="date" class="form-control mb-2" aria-label="Todo due Date Input">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="dialog-close btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="dialog-submit btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
  `

  private constructor(
    private dialog: HTMLDivElement,
    private modal: bootstrap.Modal,
    private nameInput: HTMLInputElement,
    private descriptionInput: HTMLInputElement,
    private dueDateInput: HTMLInputElement,
    private submitButton: HTMLButtonElement,
  ) {}

  /**
   * Renders the modal dialog and appends it to the body.
   * @param onClose Optional callback function to be called when the modal is closed.
   * @returns An instance of TodoModalDialog.
   */
  private static render(onClose?: () => void): TodoModalDialog {
    const body = document.querySelector('body') as HTMLBodyElement;
    const template = document.createElement('template');
    template.innerHTML = TodoModalDialog.template;
    const dialog = template.content.firstElementChild as HTMLDivElement;
    const closeButton = dialog.querySelector('.dialog-close') as HTMLButtonElement;

    const modal = new bootstrap.Modal(dialog);

    const instance = new TodoModalDialog(
      dialog,
      modal,
      dialog.querySelector('#todo-title') as HTMLInputElement,
      dialog.querySelector('#todo-description') as HTMLInputElement,
      dialog.querySelector('#todo-dueDate') as HTMLInputElement,
      dialog.querySelector('.dialog-submit') as HTMLButtonElement,
    );

    dialog.addEventListener('hidden.bs.modal', () => {
      instance.close();
      onClose?.();
    });

    closeButton.addEventListener('click', () => {
      modal.hide();
    });

    body.appendChild(dialog);
    return instance;
  }

  /**
   * Opens the modal dialog for editing an existing to-do item.
   * @param todo The to-do item to be edited.
   * @param onSave Callback function to be called when the save button is clicked.
   * @param onClose Optional callback function to be called when the modal is closed.
   */
  public static openEdit(
    todo: Todo,
    onSave: (t: Todo) => void,
    onClose?: () => void
  ): TodoModalDialog {
    const todoModalDialog = TodoModalDialog.render(onClose);

    // Set the values of the todo in the form
    todoModalDialog.nameInput.value = todo.title;
    todoModalDialog.descriptionInput.value = todo.description;
    todoModalDialog.dueDateInput.value = todo.dueDate?.toISOString().substring(0, 10) ?? '';

    todoModalDialog.submitButton.addEventListener('click', async (event) => {
      const updatedTodo: Todo = {
        ...todo,
        title: todoModalDialog.nameInput.value,
        description: todoModalDialog.descriptionInput.value,
        dueDate: new Date(todoModalDialog.dueDateInput.value)
      };
      onSave(updatedTodo);
      todoModalDialog.modal.hide();
    });

    todoModalDialog.modal.show();
    return todoModalDialog;
  }

  /**
   * Opens the modal dialog for creating a new to-do item.
   * @param onSave Callback function to be called when the save button is clicked.
   * @param onClose Optional callback function to be called when the modal is closed.
   */
  public static open(
    onSave: (t: NewTodo) => void,
    onClose?: () => void
  ): TodoModalDialog {
    const todoModalDialog = TodoModalDialog.render(onClose);

    todoModalDialog.submitButton.addEventListener('click', async (event) => {
      const todo: NewTodo = {
        title: todoModalDialog.nameInput.value,
        description: todoModalDialog.descriptionInput.value,
        dueDate: new Date(todoModalDialog.dueDateInput.value)
      };
      onSave(todo);
      todoModalDialog.modal.hide();
    });

    todoModalDialog.modal.show();
    return todoModalDialog;
  }

  /**
   * Closes the modal dialog and disposes of the instance.
   */
  public close(): void {
    this.dialog.remove();
    this.modal.dispose();
  }
}
