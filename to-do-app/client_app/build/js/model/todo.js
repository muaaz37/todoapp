/**
 * Status of a to-do item.
 */
export var TodoStatus;
(function (TodoStatus) {
    /**
     * Indicates that the to-do item is open, i.e., the to-do is not completed.
     */
    TodoStatus["OPEN"] = "open";
    /**
     * Indicates that the to-do item is done, i.e., the to-do is completed.
     */
    TodoStatus["DONE"] = "done";
})(TodoStatus || (TodoStatus = {}));
