package de.thm.mni.ip.user.db;

import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.util.security.PasswordEncoder;
import io.vertx.core.Future;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
/**
 * Mock implementation of UserDB for testing purposes.
 * This class simulates a user database using an in-memory map.
 */
public class UserMockDB implements UserDB {

  private Map<UUID, User> users = new HashMap<>(
    Map.of(
      UUID.fromString("123e4567-e89b-12d3-a456-426614174000"),
      new User(
        UUID.fromString("123e4567-e89b-12d3-a456-426614174000"),
        "max.mustermann@mni.thm.de",
        PasswordEncoder.encode("password"),
        "Max",
        "Mustermann"
      )
    )
  );

  public UserMockDB() {
    // Constructor
  }

  public Future<Void> create(User user) {
    if (user == null) {
      throw new IllegalArgumentException("User cannot be null");
    }
    users.put(user.getId(), user);

    return Future.succeededFuture();
  }

  @Override
  public Future<List<User>> getAll() {
    return Future.succeededFuture(List.copyOf(users.values()));
  }

  @Override
  public Future<Optional<User>> find(UUID id) {
    if (id == null) {
      return Future.failedFuture(new IllegalArgumentException("ID cannot be null"));
    }
    return Future.succeededFuture(Optional.ofNullable(users.get(id)));
  }

  @Override
  public Future<Void> update(User user) {
    if (user == null) {
      return Future.failedFuture(new IllegalArgumentException("User cannot be null"));
    }
    users.put(user.getId(), user);
    return Future.succeededFuture();
  }

  @Override
  public Future<Void> delete(UUID id) {
    if (id == null) {
      return Future.failedFuture(new IllegalArgumentException("ID cannot be null"));
    }
    users.remove(id);
    return Future.succeededFuture();
  }

  @Override
  public Future<Optional<User>> findByEmail(String email) {
    if (email == null) {
      return Future.failedFuture(new IllegalArgumentException("Email cannot be null"));
    }
    var user = users.values().stream()
        .filter(u -> u.getEmail().equals(email))
        .findFirst();

    return Future.succeededFuture(user);
  }
}
