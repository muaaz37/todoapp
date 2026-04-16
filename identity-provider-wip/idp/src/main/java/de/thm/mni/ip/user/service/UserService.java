package de.thm.mni.ip.user.service;

import de.thm.mni.ip.user.db.UserDB;
import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.util.security.PasswordEncoder;
import io.vertx.core.Future;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing users.
 * Provides methods to create, retrieve, update, and delete users.
 */
public class UserService {

  private final UserDB userDB;

  /**
   * Constructs a UserService with the specified UserDB.
   *
   * @param userDB The UserDB to access user data.
   * @throws IllegalArgumentException if userDB is null.
   */
  public UserService(UserDB userDB) {
    this.userDB = userDB;
  }

  /**
   * Creates a new user with a hashed password.
   *
   * @param user The user to create.
   * @throws IllegalArgumentException if the user is null.
   */
  public Future<Void> create(User user) {
    if (user == null) {
      return Future.failedFuture(new IllegalArgumentException("User cannot be null"));
    }

    var userWithHashedPassword = new User(
      user.getId(),
      user.getEmail(),
      PasswordEncoder.encode(user.getPassword()),
      user.getFirstName(),
      user.getLastName()
    );

    return userDB.create(userWithHashedPassword);
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param id The ID of the user to retrieve.
   * @return An Optional containing the user if found, or empty if not found.
   * @throws IllegalArgumentException if the ID is null.
   */
  public Future<Optional<User>> getById(UUID id) {
    if (id == null) {
      return Future.failedFuture(new IllegalArgumentException("ID cannot be null"));
    }
    return userDB.find(id);
  }

  /**
   * Retrieves all users.
   *
   * @return A list of all users.
   */
  public Future<List<User>> getAll() {
    return userDB.getAll();
  }

  /**
   * Updates an existing user.
   *
   * @param user The user to update.
   * @throws IllegalArgumentException if the user is null.
   */
  public Future<Void> update(User user) {
    if (user == null) {
      return Future.failedFuture(new IllegalArgumentException("User cannot be null"));
    }
    return userDB.update(user);
  }

  /**
   * Deletes a user by their ID.
   *
   * @param userId The ID of the user to delete.
   * @throws IllegalArgumentException if the userId is null.
   */
  public Future<Void> deleteById(UUID userId) {
    if (userId == null) {
      return Future.failedFuture(new IllegalArgumentException("ID cannot be null"));
    }
    return userDB.delete(userId);
  }
}
