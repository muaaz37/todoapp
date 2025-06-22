import { TodoStatus } from "../model/todo.js";
/**
 * TodoStatusParser is a utility class that provides methods to parse and convert.
 */
export class TodoStatusParser {
    /**
     * Parses the status of a to-do item.
     * @param status - The status to parse.
     * @returns The parsed status or undefined if not valid.
     */
    static parse(status) {
        switch (status.toLowerCase()) {
            case 'open':
                return TodoStatus.OPEN;
            case 'done':
                return TodoStatus.DONE;
            default:
                return undefined;
        }
    }
    constructor() {
        throw new Error('This class cannot be instantiated');
    }
}
