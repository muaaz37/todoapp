# Generate RSA Key Pair

1. Generate a 4096-bit RSA private key in PEM format

```bash
openssl genrsa -out private.html 4096
```

2. Derive a 4096-bit RSA public key from the private key in PEM format

```bash
openssl rsa -in private.html -pubout -out public-key.pem
```
