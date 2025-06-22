package de.thm.mni.ip.auth.api;

import de.thm.mni.ip.auth.api.dto.LoginRequest;
import de.thm.mni.ip.auth.api.dto.TokenResponse;
import de.thm.mni.ip.auth.service.AuthService;
import de.thm.mni.ip.auth.util.TokenHandler;
import de.thm.mni.ip.user.api.dto.UserResponse;
import io.vertx.core.json.Json;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import java.util.NoSuchElementException;

/**
 * AuthApi provides endpoints for user authentication and token verification.
 * It handles login requests and verifies user tokens.
 */
public class AuthApi {

  private final AuthService authService;
  private final TokenHandler tokenHandler;

  private final String TOKEN_TYPE_BEARER = "Bearer";// 15 minutes

  /**
   * Constructs an AuthApi instance with the provided AuthService and TokenHandler.
   *
   * @param authService the service for handling authentication logic
   * @param tokenHandler the handler for creating and verifying tokens
   */
  public AuthApi(
          AuthService authService,
          TokenHandler tokenHandler
  ) {
    if (authService == null) {
      throw new IllegalArgumentException("AuthService cannot be null");
    }
    if (tokenHandler == null) {
      throw new IllegalArgumentException("TokenHandler cannot be null");
    }

    this.authService = authService;
    this.tokenHandler = tokenHandler;
  }

  /**
   * Appends the authentication routes to the provided router.
   *
   * @param router the router to which the routes will be added
   * @param apiBasePath the base path for the API endpoints
   */
  public void appendRouting(Router router, String apiBasePath) {
    router.post(apiBasePath + "/auth/token").handler(this::handleLogin);
    router.get(apiBasePath + "/auth/me").handler(this::handleVerify);
  }

  private void handleVerify(RoutingContext rc) {
    var authorization = rc.request().getHeader("Authorization");
    if (authorization == null || !authorization.startsWith(TOKEN_TYPE_BEARER + " ")) {
      unauthorized(rc);
      return;
    }

    var token = authorization.substring(TOKEN_TYPE_BEARER.length()).trim();

    try {
      var userId = tokenHandler.verify(token);
      var userOptional = authService.getById(userId);

      if (userOptional.isEmpty()) {
        unauthorized(rc);
        return;
      }

      var user = userOptional.get();

      var userResponse = new UserResponse(
              user.getId(),
              user.getEmail(),
              user.getFirstName(),
              user.getLastName()
      );

      rc.response()
              .setStatusCode(200)
              .putHeader("Content-Type", "application/json")
              .end(Json.encode(userResponse));
    } catch (IllegalArgumentException e) {
      unauthorized(rc);
    }
  }

  private void handleLogin(RoutingContext rc) {
    var loginData = rc.body().asPojo(LoginRequest.class);

    try {
      var user = authService.authenticate(
              loginData.email(),
              loginData.password()
      );

      var token = tokenHandler.create(user);

      rc.response()
              .setStatusCode(200)
              .putHeader("Content-Type", "application/json")
              .end(Json.encode(new TokenResponse(
                      token,
                      TOKEN_TYPE_BEARER
              )));

    } catch (IllegalArgumentException | NoSuchElementException e) {
      unauthorized(rc);
    }
  }

  private void unauthorized(RoutingContext rc) {
    rc.response()
            .setStatusCode(401)
            .end("Unauthorized");
  }
}
