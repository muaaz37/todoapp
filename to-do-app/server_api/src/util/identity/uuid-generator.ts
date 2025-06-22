import {v4 as uuidv4} from 'uuid';

/**
 * UUID utility class for generating globally unique identifiers.
 */
export class UUIDGenerator {

  /**
   * Generates a new globally unique UUID.
   *
   * @returns A new UUID.
   */
  public static generate(): string {
    return uuidv4();
  }

  private constructor() {
    throw new Error('This class cannot be instantiated');
  }
}
