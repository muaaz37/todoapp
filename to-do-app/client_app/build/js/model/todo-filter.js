/**
 * Specifies a filter options that a to-do item must match to be included in a result set.
 */
export class TodoFilter {
    title;
    status;
    /**
     * Filter options for a to-do item to filter by title and status.
     * @param title The title that should be included in the to-do item title (case_insensitive).
     * @param status The status that should be equal to the to-do item status.
     */
    constructor(title = undefined, status = undefined) {
        this.title = title;
        this.status = status;
    }
}
