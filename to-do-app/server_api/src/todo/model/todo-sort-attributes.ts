/**
 * Enum representing the parameters by which a list of to-do items can be sorted.
 *
 * Use this enum to specify the criterion for sorting to-do items,
 * such as by creation date or due date.
 *
 * @enum {string}
 */
export enum TodoSortAttributes {

  /**
   * Sort to-do items by their title.
   */
  TITLE = 'title',

  /**
   * Sort to-do items by their status.
   */
  STATUS = 'status',

  /**
   * Sort to-do items by their creation date.
   */
  CREATED_AT = 'createdAt',

  /**
   * Sort to-do items by their due date.
   */
  DUE_DATE = 'dueDate',
}
