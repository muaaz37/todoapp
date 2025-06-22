package de.thm.mni.ip.user.api.dto;

import java.util.UUID;

public record UserResponse(
  UUID id,
  String email,
  String firstName,
  String lastName
) {
}
