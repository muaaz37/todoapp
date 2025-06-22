package de.thm.mni.ip.util.security;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

/**
 * Utility class for reading RSA public and private keys from files.
 * The keys are expected to be in PEM format.
 */
public final class RSAKeyReader {

  /**
   * Reads an RSA public key from a file.
   *
   * @param filePath the path to the file containing the public key in PEM format
   *
   * @return the RSA public key
   *
   * @throws RuntimeException if the key cannot be read or parsed
   */
  public static RSAPublicKey readPublicKey(Path filePath) {
    try {
      String key = Files.readString(filePath)
        .replaceAll("-----BEGIN PUBLIC KEY-----", "")
        .replaceAll("-----END PUBLIC KEY-----", "")
        .replaceAll("\\s", "");
      return (RSAPublicKey) KeyFactory.getInstance("RSA")
          .generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(key)));
    } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
      throw new RuntimeException("Failed to read public key", e);
    }
  }

  /**
   * Reads an RSA private key from a file.
   *
   * @param filePath the path to the file containing the private key in PEM format
   *
   * @return the RSA private key
   *
   * @throws RuntimeException if the key cannot be read or parsed
   */
  public static RSAPrivateKey readPrivateKey(Path filePath) {
    try {
      String key = Files.readString(filePath)
        .replaceAll("-----BEGIN PRIVATE KEY-----", "")
        .replaceAll("-----END PRIVATE KEY-----", "")
        .replaceAll("\\s", "");
      return (RSAPrivateKey) KeyFactory.getInstance("RSA")
          .generatePrivate(new PKCS8EncodedKeySpec(Base64.getDecoder().decode(key)));
    } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
      throw new RuntimeException("Failed to read private key", e);
    }
  }

  private RSAKeyReader() {
    throw new UnsupportedOperationException("Utility class");
  }
}
