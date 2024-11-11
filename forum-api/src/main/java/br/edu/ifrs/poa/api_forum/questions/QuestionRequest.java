package br.edu.ifrs.poa.api_forum.questions;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record QuestionRequest(
        @NotBlank(message = "O título é obrigatório")
        @Size(min = 5, max = 100, message = "O título deve ter entre 5 e 100 caracteres")
        String title,
        @NotBlank(message = "O conteúdo é obrigatório")
        @Size(min = 10, max = 1000, message = "O conteúdo deve ter entre 10 e 1000 caracteres")
        String content,
        @NotBlank(message = "O tópico é obrigatório")
        @Size(max = 30, message = "O tópico deve ter no maximo 30 caracteres")
        String topic,
        @NotBlank(message = "A categoria é obrigatória")
        @Size(max = 100, message = "O tópico deve ter no maximo 100 caracteres")
        String category,
        @NotBlank(message = "O ID do usuário é obrigatório")
        @JsonProperty("user_id")
        String userId,
        @NotBlank(message = "O nome de usuário é obrigatório")
        String username
) {
}