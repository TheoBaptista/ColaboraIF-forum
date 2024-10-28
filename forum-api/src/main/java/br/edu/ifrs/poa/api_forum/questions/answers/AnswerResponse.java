package br.edu.ifrs.poa.api_forum.questions.answers;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AnswerResponse(
        String id,
        String content,
        @JsonProperty("is_correct_answer")
        boolean isCorrectAnswer,
        @JsonProperty("user_id")
        String userId,
        String username) {

    public AnswerResponse(Answer answer) {
        this(
                answer.getId(),
                answer.getContent(),
                answer.isCorrectAnswer(),
                answer.getUserId(),
                answer.getUsername()
        );
    }

}
