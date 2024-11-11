package br.edu.ifrs.poa.api_forum.questions.answers;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.UUID;

@Data
public class Answer {

    @Id
    private String id;
    private String content;
    private boolean isCorrectAnswer;
    private String userId;
    private String username;


    public Answer(String content, boolean isCorrectAnswer, String userId, String username) {
        this.id = UUID.randomUUID().toString();
        this.content = content;
        this.isCorrectAnswer = isCorrectAnswer;
        this.userId = userId;
        this.username = username;
    }

}
