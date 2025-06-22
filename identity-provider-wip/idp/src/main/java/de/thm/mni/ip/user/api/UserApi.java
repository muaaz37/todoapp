package de.thm.mni.ip.user.api;

import de.thm.mni.ip.user.api.dto.CreateUser;
import de.thm.mni.ip.user.api.dto.UpdateUser;
import de.thm.mni.ip.user.api.dto.UserResponse;
import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.user.service.UserService;
import io.vertx.core.json.Json;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

import java.util.NoSuchElementException;
import java.util.UUID;

/**
 * UserApi provides endpoints for managing users.
 * It handles user creation, retrieval, updating, and deletion.
 */
public class UserApi {

  private final UserService userService;

  /**
   * Constructs a UserApi instance with the provided UserService.
   *
   * @param userService the service for handling user-related operations
   */
  public UserApi(UserService userService) {
    if (userService == null) {
      throw new IllegalArgumentException("UserService cannot be null");
    }
    this.userService = userService;
  }

  /**
   * Appends the user-related routes to the provided router.
   *
   * @param router the router to which the routes will be added
   * @param apiBasePath the base path for the API endpoints
   */
  public void appendRouting(Router router, String apiBasePath) {
    router.post(apiBasePath + "/users").handler(this::createUser);
    router.get(apiBasePath + "/users").handler(this::getAllUsers);
    router.get(apiBasePath + "/users/:id").handler(this::getUserById);
    router.put(apiBasePath + "/users/:id").handler(this::updateUser);
    router.delete(apiBasePath + "/users/:id").handler(this::deleteUser);
  }

  private void createUser(RoutingContext rc) {
    var createUser = rc.body().asPojo(CreateUser.class);

    var user = new User(
      UUID.randomUUID(),
      createUser.email(),
      createUser.password(),
      createUser.firstName(),
      createUser.lastName()
    );

    userService.create(user);

    var userResponse = new UserResponse(
      user.getId(),
      user.getEmail(),
      user.getFirstName(),
      user.getLastName()
    );

    rc.response().setStatusCode(201).end(Json.encode(userResponse));
  }

  private void getAllUsers(RoutingContext rc) {
    var users = userService.getAll();  // <-- Korrekt auf UserService
    var userResponses = users.stream()
            .map(user -> new UserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName()
            ))
            .toList();

    rc.response().setStatusCode(200).end(Json.encode(userResponses));
  }
  private void getUserById(RoutingContext rc) {
    try {
      var userId = UUID.fromString(rc.pathParam("id"));
      var userOptional = userService.getById(userId);  // <-- Korrekt

      if (userOptional.isEmpty()) {
        rc.response().setStatusCode(404).end("User not found");
        return;
      }

      var user = userOptional.get();
      var userResponse = new UserResponse(
              user.getId(),
              user.getEmail(),
              user.getFirstName(),
              user.getLastName()
      );

      rc.response().setStatusCode(200).end(Json.encode(userResponse));
    } catch (IllegalArgumentException e) {
      rc.response().setStatusCode(400).end("Invalid user ID");
    }
  }

  private void updateUser(RoutingContext rc) {
    try {
      var userId = UUID.fromString(rc.pathParam("id"));
      var updateUser = rc.body().asPojo(UpdateUser.class);

      var existingUserOptional = userService.getById(userId);
      if (existingUserOptional.isEmpty()) {
        rc.response().setStatusCode(404).end("User not found");
        return;
      }

      var updatedUser = new User(
              userId,
              updateUser.email(),
              existingUserOptional.get().getPassword(), // Behalte Passwort
              updateUser.firstName(),
              updateUser.lastName()
      );

      userService.update(updatedUser);

      var userResponse = new UserResponse(
              updatedUser.getId(),
              updatedUser.getEmail(),
              updatedUser.getFirstName(),
              updatedUser.getLastName()
      );

      rc.response().setStatusCode(200).end(Json.encode(userResponse));
    } catch (IllegalArgumentException e) {
      rc.response().setStatusCode(400).end("Invalid user ID");
    }
  }

  private void deleteUser(RoutingContext rc) {
    try {
      var userId = UUID.fromString(rc.pathParam("id"));
      var userOptional = userService.getById(userId);
      if (userOptional.isEmpty()) {
        rc.response().setStatusCode(404).end("User not found");
        return;
      }

      userService.deleteById(userId);
      rc.response().setStatusCode(204).end();
    } catch (IllegalArgumentException e) {
      rc.response().setStatusCode(400).end("Invalid user ID");
    }
  }

}