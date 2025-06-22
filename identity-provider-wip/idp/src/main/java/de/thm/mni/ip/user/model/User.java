package de.thm.mni.ip.user.model;

import java.util.UUID;

/**
 * Represents a user in the system.
 * This class encapsulates user details such as ID, email, password, first name, and last name.
 */
public class User {
  private UUID id;
  private String email;
  private String password;
  private String firstName;
  private String lastName;

  /**
   * Constructs a User with the specified details.
   *
   * @param id The unique identifier for the user. Must not be null.
   * @param email The email address of the user. Must not be null or empty.
   * @param password The password of the user. Must not be null or blank.
   * @param firstName The first name of the user. Must not be null or blank.
   * @param lastName The last name of the user. Must not be null or blank.
   */
  public User(UUID id, String email, String password, String firstName, String lastName) {
    if (id == null) {
      throw new IllegalArgumentException("ID cannot be null");
    }
    if (email == null || email.isBlank()) {
      throw new IllegalArgumentException("Email cannot be null or empty");
    }
    if (password == null || password.isBlank()) {
      throw new IllegalArgumentException("Password cannot be null or blank");
    }
    if (firstName == null || firstName.isBlank()) {
      throw new IllegalArgumentException("First name cannot be null or blank");
    }
    if (lastName == null || lastName.isBlank()) {
      throw new IllegalArgumentException("Last name cannot be null or blank");
    }

    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  /**
   * Constructs a User with a randomly generated ID.
   *
   * @param email The email address of the user. Must not be null or empty.
   * @param password The password of the user. Must not be null or blank.
   * @param firstName The first name of the user. Must not be null or blank.
   * @param lastName The last name of the user. Must not be null or blank.
   */
  public User(String email, String password, String firstName, String lastName) {
    this(UUID.randomUUID(), email, password, firstName, lastName);
  }

  public UUID getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }
}
