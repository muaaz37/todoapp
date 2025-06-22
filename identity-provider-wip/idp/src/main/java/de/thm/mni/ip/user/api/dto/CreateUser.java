package de.thm.mni.ip.user.api.dto;

public record CreateUser(
  String email,
  String password,
  String firstName,
  String lastName
) {
}
