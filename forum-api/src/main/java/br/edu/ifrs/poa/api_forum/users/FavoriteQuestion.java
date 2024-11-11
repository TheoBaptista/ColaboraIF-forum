package br.edu.ifrs.poa.api_forum.users;

import lombok.Data;
import lombok.Getter;

import java.util.UUID;

@Data
public class FavoriteQuestion {

    private String id;
    private String userId;
    private String questionId;

    public FavoriteQuestion(String userId, String questionId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.questionId = questionId;
    }

}

