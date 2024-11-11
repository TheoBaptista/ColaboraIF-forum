package br.edu.ifrs.poa.api_forum.authentication;

import jakarta.validation.constraints.NotBlank;

public record LoginCredentialsRequest(@NotBlank(message = "O username é obrigatório") String username,
                                      @NotBlank(message = "A senha é obrigatória") String password) {
}
