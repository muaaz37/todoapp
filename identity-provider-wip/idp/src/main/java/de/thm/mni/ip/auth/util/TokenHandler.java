package de.thm.mni.ip.auth.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import de.thm.mni.ip.AppInfo;
import de.thm.mni.ip.user.model.User;
import de.thm.mni.ip.util.security.RSAKeyPair;

import java.util.Date;
import java.util.UUID;

/**
 * Utility class for handling JWT tokens.
 * It provides methods to create, verify, and retrieve information from tokens.
 */
public final class TokenHandler {

  private final RSAKeyPair rsaKeyPair;
  private final Long HOUR_IN_MILLISECONDS = 3600L * 1000L;
  private final Long TOKEN_EXPIRATION_TIME = 2 * HOUR_IN_MILLISECONDS; // 2 hour

  /**
   * Constructs a TokenHandler with the specified RSAKeyPair.
   *
   * @param rsaKeyPair The RSAKeyPair to sign and verify tokens.
   */
  public TokenHandler(RSAKeyPair rsaKeyPair) {
    this.rsaKeyPair = rsaKeyPair;
  }

  /**
   * Creates a JWT token for the specified user with the default expiration time.
   *
   * @param user The user for whom the token is created.
   * @return The generated JWT token.
   */
  public String create(User user) {
    return create(user, TOKEN_EXPIRATION_TIME);
  }

  /**
   * Creates a JWT token for the specified user with a custom expiration time.
   *
   * @param user The user for whom the token is created.
   * @param timeToLiveMillis The time to live for the token in milliseconds.
   * @return The generated JWT token.
   */
  private String create(User user, Long timeToLiveMillis) {
    var expiration = new Date(System.currentTimeMillis() + timeToLiveMillis);

    return JWT.create()
            .withIssuer(AppInfo.APPLICATION_NAME)
            .withSubject(user.getId().toString())
            .withIssuedAt(new Date())
            .withClaim("email", user.getEmail())
            .withExpiresAt(expiration)
            .sign(Algorithm.RSA256(rsaKeyPair.privateKey()));
  }

  /**
   * Verifies the given JWT token.
   *
   * @param token The JWT token to verify.
   * @return Returns the user ID if the token is valid.
   *
   * @throws RuntimeException if the token is invalid or expired.
   */
  public UUID verify(String token) {
    var jwt = JWT.require(Algorithm.RSA256(rsaKeyPair.publicKey()))
            .withIssuer(AppInfo.APPLICATION_NAME)
            .build()
            .verify(token);

    return UUID.fromString(jwt.getSubject());
  }

  /**
   * Retrieves the subject (user ID) from the given JWT token.
   *
   * @param token The JWT token from which to retrieve the subject.
   * @return The subject of the token, typically the user ID.
   */
  public static String retrieveSubject(String token) {
    return JWT.decode(token).getSubject();
  }
}
