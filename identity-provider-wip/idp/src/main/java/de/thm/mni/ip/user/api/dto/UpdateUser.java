package de.thm.mni.ip.user.api.dto;

public record UpdateUser(
  String email,
  String firstName,
  String lastName
) {
}
