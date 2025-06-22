package de.thm.mni.ip.user.db;

import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.util.security.PasswordEncoder;

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

  public void create(User user) {
    if (user == null) {
      throw new IllegalArgumentException("User cannot be null");
    }
    users.put(user.getId(), user);
  }

  @Override
  public List<User> getAll() {
    return List.copyOf(users.values());
  }

  @Override
  public Optional<User> find(UUID id) {
    if (id == null) {
      throw new IllegalArgumentException("ID cannot be null");
    }
    return Optional.ofNullable(users.get(id));
  }

  @Override
  public void update(User user) {
    if (user == null) {
      throw new IllegalArgumentException("User cannot be null");
    }
    users.put(user.getId(), user);
  }

  @Override
  public void delete(UUID id) {
    if (id == null) {
      throw new IllegalArgumentException("ID cannot be null");
    }
    users.remove(id);
  }

  @Override
  public Optional<User> findByEmail(String email) {
    if (email == null) {
      throw new IllegalArgumentException("Email cannot be null");
    }
    return users.values().stream()
        .filter(user -> user.getEmail().equals(email))
        .findFirst();
  }
}
