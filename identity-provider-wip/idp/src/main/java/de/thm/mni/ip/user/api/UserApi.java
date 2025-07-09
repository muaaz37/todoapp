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
    router.get(apiBasePath + "/users").handler(this::getAllUsers);
    router.get(apiBasePath + "/users/:id").handler(this::getUserById);
    router.post(apiBasePath + "/users").handler(this::createUser);
    router.put(apiBasePath + "/users/:id").handler(this::updateUser);
    router.delete(apiBasePath + "/users/:id").handler(this::deleteUser);
  }

  private void deleteUser(RoutingContext rc) {
    var id = rc.request().getParam("id");
    if (id == null) {
      rc.response().setStatusCode(400).end("Missing 'id' parameter");
      return;
    }

    UUID userId = UUID.fromString(rc.pathParam("id"));

    userService.deleteById(userId)
      .onSuccess(v -> {
        rc.response().setStatusCode(204).end();
      })
      .onFailure(err -> {
        rc.response().setStatusCode(500).end("Internal Server Error: " + err.getMessage());
      });
  }

  private void updateUser(RoutingContext rc) {
    var id = rc.pathParam("id");
    if (id == null) {
      rc.response().setStatusCode(400).end("Missing 'id' parameter");
      return;
    }

    UUID userId = UUID.fromString(id);
    var updateUserData = rc.body().asPojo(UpdateUser.class);

    userService.getById(userId)
      .map(maybeUser -> {
        if (maybeUser.isEmpty()) {
          throw new NoSuchElementException("User not found");
        }
        return maybeUser.get();
      })
      .map(foundUser -> {
        return new User(
          foundUser.getId(),
          updateUserData.email() != null ? updateUserData.email() : foundUser.getEmail(),
          foundUser.getPassword(), // Password should not be updated here
          updateUserData.firstName() != null ? updateUserData.firstName() : foundUser.getFirstName(),
          updateUserData.lastName() != null ? updateUserData.lastName() : foundUser.getLastName()
        );
      })
      .flatMap(userService::update)
      .onSuccess(v -> {
        rc.response().setStatusCode(204).end();
      })
      .onFailure(err -> {
        rc.response().setStatusCode(500).end("Internal Server Error: " + err.getMessage());
      });
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

    userService.create(user)
      .onSuccess(v -> {
        rc.response().setStatusCode(201).end();
      })
      .onFailure(err -> {
        rc.response().setStatusCode(500).end("Internal Server Error");
      });
  }

  private void getUserById(RoutingContext rc) {
    var id = rc.request().getParam("id");
    if (id == null) {
      rc.response().setStatusCode(400).end("Missing 'id' parameter");
      return;
    }

    UUID userId = UUID.fromString(rc.pathParam("id"));

    userService.getById(userId)
      .map(user -> {
        if (user.isEmpty()) {
          throw new NoSuchElementException("User not found");
        }
        return user.get();
      })
      .map(user -> new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getFirstName(),
        user.getLastName()
      ))
      .onSuccess(userResponse -> {
        rc.response().setStatusCode(200).end(Json.encode(userResponse));
      })
      .onFailure(throwable -> {
        if (throwable instanceof NoSuchElementException) {
          rc.response().setStatusCode(404).end("User not found");
          return;
        } else {
          rc.response().setStatusCode(500).end("Internal Server Error");
        }
      });
  }

  private void getAllUsers(RoutingContext rc) {
    userService.getAll()
      .map(users -> {
        return users.stream().map(user -> new UserResponse(
          user.getId(),
          user.getEmail(),
          user.getFirstName(),
          user.getLastName()
        )).toList();
      })
      .onSuccess(userList -> {
        rc.response().setStatusCode(200).end(Json.encode(userList));
      })
      .onFailure(throwable -> {
        rc.response().setStatusCode(500).end("Internal Server Error");
      });
  }
}
