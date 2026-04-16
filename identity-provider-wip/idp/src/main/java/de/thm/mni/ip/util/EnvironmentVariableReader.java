package de.thm.mni.ip.util;

/**
 * Utility class for accessing environment variables.
 */
public final class EnvironmentVariableReader {

  /**
   * Retrieves the value of the specified environment variable.
   *
   * @param key the name of the environment variable
   * @param defaultValue the default value if no value for the key is set
   *
   * @return the value of the environment variable, or the default value if it is not set
   */
  public static String get(String key, String defaultValue) {
    String value = System.getenv(key);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  /**
   * Retrieves the value of the specified environment variable as an integer.
   *
   * @param key the name of the environment variable
   * @param defaultValue the default value if no value for the key is set
   *
   * @return the value of the environment variable as an integer, or the default value if it is not set
   *
   * @throws NumberFormatException if the value cannot be parsed as an integer
   */
  public static int getAsInt(String key, int defaultValue) {
    String value = System.getenv(key);
    if (value == null) {
      return defaultValue;
    }
    return Integer.parseInt(value);
  }

  private EnvironmentVariableReader() {
    throw new UnsupportedOperationException("Utility class");
  }
}
