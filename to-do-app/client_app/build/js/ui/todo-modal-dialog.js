/**
 * UI component for a modal dialog to create or edit a to-do item.
 */
export class TodoModalDialog {
    dialog;
    modal;
    nameInput;
    descriptionInput;
    dueDateInput;
    submitButton;
    static template = `
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
  `;
    constructor(dialog, modal, nameInput, descriptionInput, dueDateInput, submitButton) {
        this.dialog = dialog;
        this.modal = modal;
        this.nameInput = nameInput;
        this.descriptionInput = descriptionInput;
        this.dueDateInput = dueDateInput;
        this.submitButton = submitButton;
    }
    /**
     * Renders the modal dialog and appends it to the body.
     * @param onClose Optional callback function to be called when the modal is closed.
     * @returns An instance of TodoModalDialog.
     */
    static render(onClose) {
        const body = document.querySelector('body');
        const template = document.createElement('template');
        template.innerHTML = TodoModalDialog.template;
        const dialog = template.content.firstElementChild;
        const closeButton = dialog.querySelector('.dialog-close');
        const modal = new bootstrap.Modal(dialog);
        const instance = new TodoModalDialog(dialog, modal, dialog.querySelector('#todo-title'), dialog.querySelector('#todo-description'), dialog.querySelector('#todo-dueDate'), dialog.querySelector('.dialog-submit'));
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
    static openEdit(todo, onSave, onClose) {
        const todoModalDialog = TodoModalDialog.render(onClose);
        // Set the values of the todo in the form
        todoModalDialog.nameInput.value = todo.title;
        todoModalDialog.descriptionInput.value = todo.description;
        todoModalDialog.dueDateInput.value = todo.dueDate?.toISOString().substring(0, 10) ?? '';
        todoModalDialog.submitButton.addEventListener('click', async (event) => {
            const updatedTodo = {
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
    static open(onSave, onClose) {
        const todoModalDialog = TodoModalDialog.render(onClose);
        todoModalDialog.submitButton.addEventListener('click', async (event) => {
            const todo = {
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
    close() {
        this.dialog.remove();
        this.modal.dispose();
    }
}
