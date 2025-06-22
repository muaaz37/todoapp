package de.thm.mni.ip.user.db;

import de.thm.mni.ip.user.model.User;

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
  void create(User user);

  /**
   * Finds a user by their ID.
   *
   * @param id The ID of the user to find.
   * @return An Optional containing the user if found, or empty if not found.
   * @throws IllegalArgumentException if the ID is null.
   */
  Optional<User> find(UUID id);

  /**
   * Retrieves all users from the database.
   *
   * @return A list of all users.
   */
  List<User> getAll();

  /**
   * Updates an existing user in the database.
   *
   * @param user The user to update.
   * @throws IllegalArgumentException if the user is null.
   */
  void update(User user);

  /**
   * Deletes a user by their ID.
   *
   * @param userId The ID of the user to delete.
   * @throws IllegalArgumentException if the userId is null.
   */
  void delete(UUID userId);

  /**
   * Finds a user by their email address.
   *
   * @param email The email address of the user to find.
   * @return An Optional containing the user if found, or empty if not found.
   */
  Optional<User> findByEmail(String email);

  /**
   * Deletes a user by their User object.
   *
   * @param user The user to delete.
   * @throws IllegalArgumentException if the user is null.
   */
  default void delete(User user) {
    delete(user.getId());
  }
}
