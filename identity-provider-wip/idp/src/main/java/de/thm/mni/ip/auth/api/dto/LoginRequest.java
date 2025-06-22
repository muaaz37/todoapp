package de.thm.mni.ip.auth.api.dto;

public record LoginRequest(
  String email,
  String password
) { }
