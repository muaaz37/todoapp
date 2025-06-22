package de.thm.mni.ip.user.service;


import de.thm.mni.ip.user.db.UserDB;
import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.util.security.PasswordEncoder;

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
  public void create(User user) {
    if (user == null) {
      throw new IllegalArgumentException("User cannot be null");
    }

    var userWithHashedPassword = new User(
      user.getId(),
      user.getEmail(),
      PasswordEncoder.encode(user.getPassword()),
      user.getFirstName(),
      user.getLastName()
    );

    userDB.create(userWithHashedPassword);
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param id The ID of the user to retrieve.
   * @return An Optional containing the user if found, or empty if not found.
   * @throws IllegalArgumentException if the ID is null.
   */
  public Optional<User> getById(UUID id) {
    if (id == null) {
      throw new IllegalArgumentException("ID cannot be null");
    }
    return userDB.find(id);
  }

  /**
   * Retrieves all users.
   *
   * @return A list of all users.
   */
  public List<User> getAll() {
    return userDB.getAll();
  }

  /**
   * Updates an existing user.
   *
   * @param user The user to update.
   * @throws IllegalArgumentException if the user is null.
   */
  public void update(User user) {
    if (user == null) {
      throw new IllegalArgumentException("User cannot be null");
    }
    userDB.update(user);
  }

  /**
   * Deletes a user by their ID.
   *
   * @param userId The ID of the user to delete.
   * @throws IllegalArgumentException if the userId is null.
   */
  public void deleteById(UUID userId) {
    if (userId == null) {
      throw new IllegalArgumentException("User ID cannot be null");
    }
    userDB.delete(userId);
  }
}
