package br.edu.ifrs.poa.api_forum.authentication;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank(message = "O id token é obrigatório") String idToken) {
}
