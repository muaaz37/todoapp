CREATE DATABASE idp;
\c idp;

CREATE TABLE IF NOT EXISTS "users"
(
  "id"         UUID PRIMARY KEY,
  "email"      VARCHAR(255) NOT NULL UNIQUE,
  "password"   VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name"  VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "users"
  ("id", "email", "password", "first_name", "last_name")
  VALUES (
    '123e4567-e89b-12d3-a456-426614174000',
    'max.mustermann@mni.thm.de',
    '$2a$10$gwqFR7oO3s/SklW4opFUQeLXS37eq8SVE7toa3vHhtCNv2xHsi/2G',
    'Max',
    'Mustermann'
  )
