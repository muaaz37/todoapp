package de.thm.mni.ip.util.config;

import io.vertx.core.http.HttpMethod;

import java.util.Set;

/**
 * Represents the configuration for Cross-Origin Resource Sharing (CORS).
 * This record encapsulates the allowed origins, HTTP methods, and headers
 * for CORS requests.
 */
public record CorsConfig(
  Set<String> origins,
  Set<HttpMethod> methods,
  Set<String> headers
) {
}
