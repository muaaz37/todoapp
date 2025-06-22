/**
 * Service to manage to-do items.
 */
export class TodoService {
    apiUrl;
    /**
     * Creates a new instance of the TodoService.
     * @param apiUrl The base URL of a to-do API.
     */
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        console.log(`TodoService initialized with API URL: ${this.apiUrl}`);
    }
    /**
     * Returns headers with JWT Authorization and optional additional headers.
     */
    getAuthHeaders(additionalHeaders = {}) {
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
    async getAll(filter, order) {
        let todosUrl = `${this.apiUrl}/todos?sort=${order.attribute}&order=${order.order}`;
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
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
        const data = await response.json();
        return data.data.map(this.normalize);
    }
    /**
     * Fetches a to-do item by its ID.
     * @param id The ID of the to-do item to fetch.
     *
     * @returns A promise that resolves to the to-do item with the specified ID.
     */
    async getById(id) {
        const response = await fetch(`${this.apiUrl}/todos/${id}`, {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
        const data = await response.json();
        return this.normalize(data.data);
    }
    /**
     * Creates a new to-do item.
     * @param todo The to-do item to create.
     *
     * @returns A promise that resolves to the created to-do item.
     */
    async create(todo) {
        const response = await fetch(`${this.apiUrl}/todos`, {
            method: 'POST',
            mode: 'cors',
            headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(todo)
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
        const data = await response.json();
        return this.normalize(data.data);
    }
    /**
     * Updates an existing to-do item.
     * @param todo The to-do item to update.
     *
     * @returns A promise that resolves to the updated to-do item.
     */
    async update(todo) {
        const response = await fetch(`${this.apiUrl}/todos/${todo.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(todo)
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
        const data = await response.json();
        return this.normalize(data.data);
    }
    /**
     * Updates the status of an existing to-do item.
     * @param todo The to-do item to update.
     *
     * @returns A promise that resolves to the updated to-do item.
     */
    async updateStatus(todo) {
        return this.updateStatusById(todo.id, todo.status);
    }
    /**
     * Updates the status of an existing to-do item by its ID.
     * @param id The ID of the to-do item to update.
     * @param status The new status of the to-do item.
     *
     * @returns A promise that resolves to the updated to-do item.
     */
    async updateStatusById(id, status) {
        const response = await fetch(`${this.apiUrl}/todos/${id}/status`, {
            method: 'PATCH',
            mode: 'cors',
            headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ status })
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
        const data = await response.json();
        return this.normalize(data.data);
    }
    /**
     * Deletes a to-do item by its ID.
     * @param todo The to-do item to delete.
     *
     * @returns A promise that resolves when the to-do item is deleted.
     */
    async delete(todo) {
        await this.deleteById(todo.id);
    }
    /**
     * Deletes a to-do item by its ID.
     * @param id The ID of the to-do item to delete.
     *
     * @returns A promise that resolves when the to-do item is deleted.
     */
    async deleteById(id) {
        const response = await fetch(`${this.apiUrl}/todos/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    }
    /**
     * Normalizes a to-do item by converting date strings to Date objects.
     * @param todo The to-do item to normalize.
     *
     * @returns The normalized to-do item.
     */
    normalize(todo) {
        return {
            ...todo,
            createdAt: new Date(todo.createdAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        };
    }
}
