package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.questions.answers.Answer;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerResponse;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record QuestionResponse(
        String id,
        String title,
        String content,
        String topic,
        String category,
        @JsonProperty("user_id")
        String userId,
        String username,
        List<AnswerResponse> answers
) {

    public QuestionResponse(Question question) {
        this(
                question.getId(),
                question.getTitle(),
                question.getContent(),
                question.getTopic(),
                question.getCategory(),
                question.getUserId(),
                question.getUsername(),
                question.getAnswers().stream().map(AnswerResponse::new).toList()
        );
    }

}