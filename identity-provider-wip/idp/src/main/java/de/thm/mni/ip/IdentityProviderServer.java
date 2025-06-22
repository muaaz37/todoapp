package de.thm.mni.ip;

import de.thm.mni.ip.auth.api.AuthApi;
import de.thm.mni.ip.auth.service.AuthService;
import de.thm.mni.ip.auth.util.TokenHandler;
import de.thm.mni.ip.user.api.UserApi;
import de.thm.mni.ip.user.db.UserMockDB;
import de.thm.mni.ip.user.service.UserService;
import de.thm.mni.ip.util.config.ServerConfig;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServer;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.JWTAuthHandler;

import java.security.interfaces.RSAPublicKey;
import java.util.ArrayList;
import java.util.Base64;
import java.util.function.Consumer;

public class IdentityProviderServer {

  private static final String API_BASE_PATH = "/api/v1";

  public static IdentityProviderServer start(
    ServerConfig config,
    Runnable onStart,
    Consumer<Throwable> onError
  ) {
    Vertx vertx = Vertx.vertx();

    Router router = Router.router(vertx);

    // body handler
    router.route().handler(BodyHandler.create());

    // Cors
    router.route().handler(
      CorsHandler.create()
        .addOrigins(new ArrayList<>(config.cors().origins()))
        .allowedMethods(config.cors().methods())
        .allowedHeaders(config.cors().headers())
    );

    router.route(API_BASE_PATH + "/users*").handler(
      JWTAuthHandler.create(
        JWTAuth.create(vertx, new JWTAuthOptions()
          .addPubSecKey(new PubSecKeyOptions()
            .setAlgorithm("RS256")
            .setBuffer(toPem(config.rsaKeyPair().publicKey()))
          )
        )
      )
    );


    // User api
    var userDb = new UserMockDB();
    var userService = new UserService(userDb);
    var userApi = new UserApi(userService);
    userApi.appendRouting(router, API_BASE_PATH);

    // Auth api
    var authService = new AuthService(userDb);
    var tokenHandler = new TokenHandler(config.rsaKeyPair());
    var authApi = new AuthApi(authService, tokenHandler);
    authApi.appendRouting(router, API_BASE_PATH);

    var httpServer = vertx
      .createHttpServer()
      .requestHandler(router)
      .listen(config.port(), config.host())
      .onSuccess(server -> onStart.run())
      .onFailure(onError::accept)
      .result();

    return new IdentityProviderServer(httpServer);
  }

  private final HttpServer server;

  private IdentityProviderServer(HttpServer server) {
    this.server = server;
  }

  public void stop(Runnable onStop, Consumer<Throwable> onError) {
    server.close()
      .onSuccess(v -> onStop.run())
      .onFailure(onError::accept);
  }

  private static String toPem(RSAPublicKey publicKey) {
    String encoded = Base64.getEncoder().encodeToString(publicKey.getEncoded());
    StringBuilder pem = new StringBuilder();
    pem.append("-----BEGIN PUBLIC KEY-----\n");
    for (int i = 0; i < encoded.length(); i += 64) {
      pem.append(encoded, i, Math.min(i + 64, encoded.length())).append("\n");
    }
    pem.append("-----END PUBLIC KEY-----");
    return pem.toString();
  }
}
