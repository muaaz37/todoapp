package de.thm.mni.ip;

import de.thm.mni.ip.util.config.CorsConfig;
import de.thm.mni.ip.util.EnvironmentVariableReader;
import de.thm.mni.ip.util.config.ServerConfig;
import de.thm.mni.ip.util.security.RSAKeyPair;
import de.thm.mni.ip.util.security.RSAKeyReader;
import io.vertx.core.http.HttpMethod;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import java.nio.file.Path;
import java.util.Set;

/**
 * The entry point for the Identity Provider (IdP) application.
 */
public class Start {
  private static final Logger LOGGER = LogManager.getLogger(Start.class);

  public static void main(String[] args) {
    var host = EnvironmentVariableReader.get("HOST", "localhost");
    var port = EnvironmentVariableReader.getAsInt("PORT", 8080);

    // Load rsa keys
    var publicKeyFileName = EnvironmentVariableReader.get("RSA_PUBLIC_KEY_PATH", "./keys/public-key.pem");
    var privateKeyPathFileName = EnvironmentVariableReader.get("RSA_PRIVATE_KEY_PATH", "./keys/private-key.pem");

    RSAKeyPair rsaKeyPair = null;
    try {
      rsaKeyPair = new RSAKeyPair(
        RSAKeyReader.readPublicKey(Path.of(publicKeyFileName)),
        RSAKeyReader.readPrivateKey(Path.of(privateKeyPathFileName))
      );
    } catch (Exception e) {
      LOGGER.error("Failed to load RSA keys: " + e.getMessage(), e);
      System.exit(9);
    }

    // Load configuration
    var corsConfig = new CorsConfig(
      Set.of(EnvironmentVariableReader.get("CORS_ORIGIN", String.format("http://%s:%d", host, port)).split(",")),
      Set.of(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH, HttpMethod.DELETE),
      Set.of("Content-Type", "Authorization")
    );

    var serverConfig = new ServerConfig(
      host,
      port,
      corsConfig,
      rsaKeyPair
    );

    var server = IdentityProviderServer.start(
      serverConfig,
      () -> LOGGER.info("Server started on " + serverConfig.host() + ":" + serverConfig.port()),
      throwable -> {
        LOGGER.error(throwable.getMessage(), throwable);
        System.exit(1);
      }
    );

    // add shutdown hook
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      server.stop(
        () -> LOGGER.info("Server stopped"),
        throwable -> LOGGER.error("Failed to stop server: " + throwable.getMessage())
      );
    }));
  }
}
