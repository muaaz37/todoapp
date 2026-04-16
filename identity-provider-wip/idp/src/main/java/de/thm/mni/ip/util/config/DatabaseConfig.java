package de.thm.mni.ip.util.config;

public record DatabaseConfig(
  String jdbcUrl,
  String username,
  String password
) {
  public DatabaseConfig {
    if (jdbcUrl == null || jdbcUrl.isBlank()) {
      throw new IllegalArgumentException("JDBC URL cannot be null or blank");
    }
    if (username == null || username.isBlank()) {
      throw new IllegalArgumentException("Username cannot be null or blank");
    }
    if (password == null || password.isBlank()) {
      throw new IllegalArgumentException("Password cannot be null or blank");
    }
  }
}
