package br.edu.ifrs.poa.api_forum.questions;

import com.fasterxml.jackson.annotation.JsonProperty;

public record QuestionRequest(
        String title,
        String content,
        String topic,
        String category,
        @JsonProperty("user_id")
        String userId,
        String username
) {}