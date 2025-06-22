package de.thm.mni.ip.util.config;

import de.thm.mni.ip.util.security.RSAKeyPair;

/**
 * Represents the server configuration, including host, port, CORS settings,
 * and RSA key pair for secure communications.
 *
 * @param host the hostname or IP address of the server
 * @param port the port number on which the server listens for incoming connections
 * @param cors the CORS configuration for the server, defining allowed origins, methods, and headers
 * @param rsaKeyPair the RSA key pair used for secure communication, containing both public and private keys
 */
public record ServerConfig(
  String host,
  int port,
  CorsConfig cors,
  RSAKeyPair rsaKeyPair
) {
}
