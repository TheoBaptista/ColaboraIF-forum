package br.edu.ifrs.poa.api_forum.questions.answers;

public record AnswerRequest(String content,
                            String userId,
                            String username) {
}
