package de.thm.mni.ip.user.db;

import de.thm.mni.ip.user.model.User;
import io.vertx.core.Future;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * UserDB interface for managing user data.
 * Provides methods to create, find, update, and delete users.
 */
public interface UserDB {

  /**
   * Creates a new user in the database.
   *
   * @param user The user to create.
   * @throws IllegalArgumentException if the user is null.
   */
  Future<Void> create(User user);

  /**
   * Finds a user by their ID.
   *
   * @param id The ID of the user to find.
   * @return An Optional containing the user if found, or empty if not found.
   * @throws IllegalArgumentException if the ID is null.
   */
  Future<Optional<User>> find(UUID id);

  /**
   * Retrieves all users from the database.
   *
   * @return A list of all users.
   */
  Future<List<User>> getAll();

  /**
   * Updates an existing user in the database.
   *
   * @param user The user to update.
   * @throws IllegalArgumentException if the user is null.
   */
  Future<Void> update(User user);

  /**
   * Deletes a user by their ID.
   *
   * @param userId The ID of the user to delete.
   * @throws IllegalArgumentException if the userId is null.
   */
  Future<Void> delete(UUID userId);

  /**
   * Finds a user by their email address.
   *
   * @param email The email address of the user to find.
   * @return An Optional containing the user if found, or empty if not found.
   */
  Future<Optional<User>> findByEmail(String email);

  /**
   * Deletes a user by their User object.
   *
   * @param user The user to delete.
   * @throws IllegalArgumentException if the user is null.
   */
  default Future<Void> delete(User user) {
    return delete(user.getId());
  }
}
