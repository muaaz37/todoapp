package de.thm.mni.ip.auth.service;

import de.thm.mni.ip.auth.util.InvalidCredentialsException;
import de.thm.mni.ip.user.db.UserDB;
import de.thm.mni.ip.user.model.User;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import de.thm.mni.ip.util.security.PasswordEncoder;
import io.vertx.core.Future;

/**
 * Service for user authentication.
 * Provides methods to authenticate users and retrieve user information.
 */
public class AuthService {

  private final UserDB userDB;

  /**
   * Constructs an AuthService with the specified UserDB.
   *
   * @param userDB The UserDB to access user.
   *
   * @throws IllegalArgumentException if userDB is null.
   */
  public AuthService(UserDB userDB) {
    if (userDB == null) {
      throw new IllegalArgumentException("UserDB cannot be null");
    }
    this.userDB = userDB;
  }

  /**
   * Authenticate a user with email and password.
   *
   * @param email The email of the user.
   * @param password The password of the user.
   *
   * @return The authenticated user.
   *
   * @throws NoSuchElementException if the user is not found.
   * @throws InvalidCredentialsException if the password is invalid.
   */
  public Future<User> authenticate(String email, String password) {
    return userDB.findByEmail(email)
      .map(searchResult -> {
          if (searchResult.isEmpty()) {
            throw new NoSuchElementException("User not found");
          }

          var user = searchResult.get();

          if (PasswordEncoder.matches(password, user.getPassword())) {
            return user;
          }

          throw new InvalidCredentialsException("Invalid password");
        }
      );
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param id The UUID of the user.
   * @return An Optional containing the user if found, or empty if not found.
   *
   * @throws IllegalArgumentException if the ID is null.
   */
  public Future<Optional<User>> getById(UUID id) {
    if (id == null) {
      return Future.failedFuture(new IllegalArgumentException("ID cannot be null"));
    }
    return userDB.find(id);
  }
}
