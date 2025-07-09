package de.thm.mni.ip.user.db;

import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.util.security.PasswordEncoder;
import io.vertx.core.Future;
import io.vertx.sqlclient.Pool;
import io.vertx.sqlclient.Row;
import io.vertx.sqlclient.Tuple;

import java.util.*;

/**
 * Mock implementation of UserDB for testing purposes.
 * This class simulates a user database using an in-memory map.
 */
public class UserSQLDB implements UserDB {

  // jdbc connection pool for database operations
  private final Pool pool;

  /**
   * Constructor for UserSQLDB.
   *
   * @param pool the connection pool to use for database operations
   * @throws NullPointerException if the pool is null
   */
  public UserSQLDB(Pool pool) {
    Objects.requireNonNull(pool);
    this.pool = pool;
  }

  public Future<Void> create(User user) {
    if (user == null) {
      return Future.failedFuture("User must not be null");
    }

    return pool.preparedQuery("INSERT INTO users (id, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)")
            .execute(Tuple.of(
                    user.getId(),
                    user.getEmail(),
                    PasswordEncoder.encode(user.getPassword()),
                    user.getFirstName(),
                    user.getLastName())
            )
            .map(rowSet -> {
              if (rowSet.rowCount() == 0) {
                throw new RuntimeException("Failed to create user in the database");
              }
              return null; // Void return type
            });
  }

  @Override
  public Future<List<User>> getAll() {
    return pool
            .preparedQuery("SELECT id, email, password, first_name, last_name FROM users")
            .execute()
            .map(rowSet -> {
              List<User> users = new ArrayList<>();
              for (Row row : rowSet) {
                users.add(mapRowToUser(row));
              }
              return users;
            });
  }

  @Override
  public Future<Optional<User>> find(UUID id) {
    if (id == null) {
      return Future.failedFuture(new IllegalArgumentException("ID cannot be null"));
    }

    return pool.preparedQuery("SELECT id, email, password, first_name, last_name FROM users WHERE id = ?")
            .execute(Tuple.of(id))
            .map(rowSet -> {
              if (rowSet.rowCount() == 0) {
                return Optional.empty();
              }
              Row row = rowSet.iterator().next();
              User user = mapRowToUser(row);
              return Optional.of(user);
            });
  }

  @Override
  public Future<Void> update(User user) {
    if (user == null) {
      return Future.failedFuture("User must not be null");
    }

    return pool
            .preparedQuery(
                    "UPDATE users " +
                            "SET email = ?, password = ?, first_name = ?, last_name = ? " +
                            "WHERE id = ?"
            )
            .execute(Tuple.of(
                    user.getEmail(),
                    PasswordEncoder.encode(user.getPassword()),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getId()
            ))
            .compose(rowSet -> {
              if (rowSet.rowCount() == 0) {
                return Future.failedFuture(
                        new NoSuchElementException("No user with id " + user.getId())
                );
              }
              return Future.succeededFuture();
            });
  }


  @Override
  public Future<Void> delete(UUID id) {
    if (id == null) {
      return Future.failedFuture(new IllegalArgumentException("ID cannot be null"));
    }

    return pool
            .preparedQuery("DELETE FROM users WHERE id = ?")
            .execute(Tuple.of(id))
            .compose(rowSet -> {
              if (rowSet.rowCount() == 0) {
                return Future.failedFuture(
                        new NoSuchElementException("No user with id " + id)
                );
              }
              return Future.succeededFuture();
            });
  }

  @Override
  public Future<Optional<User>> findByEmail(String email) {
    if (email == null) {
      return Future.failedFuture(new IllegalArgumentException("Email cannot be null"));
    }

    return pool.preparedQuery("SELECT id, email, password, first_name, last_name FROM users WHERE email = ?")
      .execute(Tuple.of(email))
      .map(rowSet -> rowSet.rowCount() == 0 ? Optional.empty() : Optional.of(mapRowToUser(rowSet.iterator().next())));
  }

  private User mapRowToUser(Row row) {
    UUID id = row.getUUID("id");
    String email = row.getString("email");
    String password = row.getString("password");
    String firstName = row.getString("first_name");
    String lastName = row.getString("last_name");

    return new User(id, email, password, firstName, lastName);
  }
}
