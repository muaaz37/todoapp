package de.thm.mni.ip.auth.api.dto;

public record TokenResponse(
  String token,
  String type
) { }
