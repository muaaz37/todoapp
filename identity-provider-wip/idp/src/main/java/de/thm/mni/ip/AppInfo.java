package de.thm.mni.ip;

import java.util.UUID;

/**
 * This class holds the application name and a secret key.
 * The information comes usually from the configuration file, but we simplify it here.
 */
public class AppInfo {
  public static final String APPLICATION_NAME = "de.thm.mni.ip";
  public static final String APPLICATION_SECRET = UUID.randomUUID().toString();
}
