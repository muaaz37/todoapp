import { TodoStatus } from "../model/todo.js";
import { TodoSortAttribute } from "../model/todo-sort-attribute.js";
import { SortOrder } from "../model/sort-order.js";
import { TodoFilter } from "../model/todo-filter.js";
import { TodoOrder } from "../model/todo-order.js";
import { TodoStatusParser } from "../util/status-parser.js";
/**
 * UI component to manage the display of to-do items in a table format.
 */
export class TodoTableManager {
    table;
    onSortFilterChangeHandler;
    static SORTABLE_ICON = 'fa-sort';
    static SORT_ASC_ICON = 'fa-sort-asc';
    static SORT_DESC_ICON = 'fa-sort-desc';
    filter = new TodoFilter();
    order = new TodoOrder();
    static template = `
      <div class="d-flex align-items-end gap-3 mb-3">
        <div class="me-2">
          <label for="title-filter" class="form-label m-auto">Title</label>
          <input type="text" id="title-filter" class="form-control" placeholder="Search To-Do...">
        </div>
        <div class="me-1">
          <label for="status-filter" class="form-label m-auto">Status</label>
          <select id="status-filter" class="form-select">
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button id="filter-btn" class="btn btn-primary">Apply Filter</button>
      </div>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th class="th-status">
            Status
            <i class="fa fa-fw fa-sort"></i>
          </th>
          <th class="th-title">
            Title
            <i class="fa fa-fw fa-sort"></i>
          </th>
          <th>Description</th>
          <th class="th-createdAt">
            CreatedAt
            <i class="fa fa-fw fa-sort"></i>
          </th>
          <th class="th-dueDate">
            DueDate
            <i class="fa fa-fw fa-sort"></i>
          </th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody></tbody>
      </table>
  `;
    /**
     * Renders the TodoTableManager component and appends it to the specified container.
     * @param container The HTML element to which the component will be appended.
     * @param onSortFilterChange The callback function to be called when the sort or filter changes.
     * @return An instance of TodoTableManager.
     */
    static render(container, onSortFilterChange) {
        const template = document.createElement('template');
        template.innerHTML = TodoTableManager.template;
        const table = template.content.querySelector('.table');
        // register sort handlers
        const thTitle = table.querySelector('.th-title');
        const thStatus = table.querySelector('.th-status');
        const thCreatedAt = table.querySelector('.th-createdAt');
        const thDueDate = table.querySelector('.th-dueDate');
        const todoTableManager = new TodoTableManager(table, onSortFilterChange);
        thTitle.addEventListener('click', () => {
            todoTableManager.changeSortOrder(TodoSortAttribute.TITLE);
        });
        thStatus.addEventListener('click', () => {
            todoTableManager.changeSortOrder(TodoSortAttribute.STATUS);
        });
        thCreatedAt.addEventListener('click', () => {
            todoTableManager.changeSortOrder(TodoSortAttribute.CREATED_AT);
        });
        thDueDate.addEventListener('click', () => {
            todoTableManager.changeSortOrder(TodoSortAttribute.DUE_DATE);
        });
        // register filter handler
        const titleFilter = template.content.querySelector('#title-filter');
        const statusFilter = template.content.querySelector('#status-filter');
        const filterButton = template.content.querySelector('#filter-btn');
        filterButton.addEventListener('click', () => {
            todoTableManager.filter = new TodoFilter(titleFilter.value, statusFilter.value === 'all' ? undefined : statusFilter.value);
            todoTableManager.changeFilter(titleFilter.value, TodoStatusParser.parse(statusFilter.value));
        });
        container.appendChild(template.content);
        return todoTableManager;
    }
    changeFilter(titleFilter, status) {
        if (titleFilter !== undefined && titleFilter.trim() === '') {
            titleFilter = undefined;
        }
        this.filter = new TodoFilter(titleFilter, status);
        this.onSortFilterChangeHandler(this.filter, this.order);
    }
    changeSortOrder(attribute) {
        const nextOrdering = this.order.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
        this.order = new TodoOrder(attribute, nextOrdering);
        this.adaptSortIcons();
        this.onSortFilterChangeHandler(this.filter, this.order);
    }
    adaptSortIcons() {
        const sortIcons = this.table.querySelectorAll('thead i');
        sortIcons.forEach(icon => {
            icon.classList.remove(TodoTableManager.SORT_ASC_ICON, TodoTableManager.SORT_DESC_ICON);
            icon.classList.add(TodoTableManager.SORTABLE_ICON);
        });
        const currentIcon = this.table.querySelector(`.th-${this.order.attribute} i`);
        currentIcon.classList.remove(TodoTableManager.SORTABLE_ICON);
        currentIcon.classList.add(this.order.order === SortOrder.ASC ? TodoTableManager.SORT_ASC_ICON : TodoTableManager.SORT_DESC_ICON);
    }
    tableBody;
    constructor(table, onSortFilterChangeHandler) {
        this.table = table;
        this.onSortFilterChangeHandler = onSortFilterChangeHandler;
        this.tableBody = this.table.querySelector('tbody');
    }
    /**
     * Returns the current filter applied to the to-do items.
     */
    getFilter() {
        return this.filter;
    }
    /**
     * Returns the current order applied to the to-do items.
     */
    getOrder() {
        return this.order;
    }
    /**
     * Adds all to-do items to the table.
     * @param todos  The array of to-do items to be added.
     * @param onEdit Callback function to be called when a to-do is triggered to be edited.
     * @param onDelete Callback function to be called when a to-do is triggered to be deleted.
     * @param onStatusChange Callback function to be called when a to-do's status is changed.
     */
    async addAll(todos, onEdit, onDelete, onStatusChange) {
        todos.forEach(t => this.add(t, onEdit, onDelete, onStatusChange));
    }
    /**
     * Adds a single to-do item to the table.
     * @param todo The to-do item to be added.
     * @param onEdit Callback function to be called when a to-do is triggered to be edited.
     * @param onDelete Callback function to be called when a to-do is triggered to be deleted.
     * @param onStatusChange Callback function to be called when a to-do's status is changed.
     */
    async add(todo, onEdit, onDelete, onStatusChange) {
        const todoElement = this.createTodoElement(todo, onEdit, onDelete, onStatusChange);
        this.tableBody.appendChild(todoElement);
    }
    /**
     * Clears all to-do items from the table.
     */
    async clear() {
        this.tableBody.replaceChildren(); // replace with nothing
    }
    static todoTemplate = `
    <tr class="">
      <td class="todo-status"><input type="checkbox"></td>
      <td class="todo-title"></td>
      <td class="todo-description"></td>
      <td class="todo-created-at"></td>
      <td class="todo-due-date"></td>
      <td>
          <a class="btn todo-edit-btn"><i class="fa-solid fa-pen"></i></a>
          <a class="btn todo-delete-btn text-danger"><i class="fa-solid fa-trash"></i></a>
      </td>
    </tr>
  `;
    createTodoElement(todo, onEdit, onDelete, onStatusChange) {
        const template = document.createElement('template');
        template.innerHTML = TodoTableManager.todoTemplate;
        const todoTableRow = template.content.firstElementChild;
        const statusCheckbox = todoTableRow.querySelector('.todo-status input');
        const titleCell = todoTableRow.querySelector('.todo-title');
        const descriptionCell = todoTableRow.querySelector('.todo-description');
        const createdAtCell = todoTableRow.querySelector('.todo-created-at');
        const dueDateCell = todoTableRow.querySelector('.todo-due-date');
        const deleteButton = todoTableRow.querySelector('.todo-delete-btn');
        const editButton = todoTableRow.querySelector('.todo-edit-btn');
        // set values of todo
        statusCheckbox.checked = todo.status === TodoStatus.DONE;
        titleCell.textContent = todo.title;
        descriptionCell.textContent = todo.description;
        // Show the date in the format "YYYY-MM-DD"
        createdAtCell.textContent = todo.createdAt.toISOString().substring(0, 10);
        dueDateCell.textContent = todo.dueDate?.toISOString().substring(0, 10) ?? '';
        // register callbacks
        deleteButton.addEventListener('click', () => onDelete(todo));
        editButton.addEventListener('click', () => onEdit(todo));
        statusCheckbox.addEventListener('change', (event) => {
            const checkbox = event.target;
            todo.status = checkbox.checked ? TodoStatus.DONE : TodoStatus.OPEN;
            onStatusChange(todo);
        });
        // style the row according to the status
        todoTableRow.classList.add('status-' + todo.status);
        return todoTableRow;
    }
}
