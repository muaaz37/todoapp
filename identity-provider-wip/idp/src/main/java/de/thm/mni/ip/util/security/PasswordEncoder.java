package de.thm.mni.ip.util.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class for encoding and matching passwords.
 * This class provides methods to encode a raw password and to check if a raw password matches an encoded password.
 */
public final class PasswordEncoder {

  private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  /**
   * Encodes a raw password using BCrypt.
   *
   * @param password The raw password to encode.
   * @return The encoded password.
   */
  public static String encode(String password) {
    return passwordEncoder.encode(password);
  }

  /**
   * Checks if a raw password matches an encoded password.
   *
   * @param rawPassword The raw password to check.
   * @param encodedPassword The encoded password to match against.
   * @return true if the raw password matches the encoded password, false otherwise.
   */
  public static boolean matches(String rawPassword, String encodedPassword) {
    return passwordEncoder.matches(rawPassword, encodedPassword);
  }

  private PasswordEncoder() {
    throw new UnsupportedOperationException("Utility class");
  }
}
