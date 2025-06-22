package de.thm.mni.ip.util.security;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

/**
 * Represents a pair of RSA keys, including a public key and a private key.
 * This record ensures that both keys are non-null upon instantiation.
 */
public record RSAKeyPair(
  RSAPublicKey publicKey,
  RSAPrivateKey privateKey
) {
  public RSAKeyPair {
    if (publicKey == null || privateKey == null) {
      throw new IllegalArgumentException("Public and private keys cannot be null");
    }
  }
}
