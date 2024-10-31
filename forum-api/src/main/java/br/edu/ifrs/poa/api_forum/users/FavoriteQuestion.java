package br.edu.ifrs.poa.api_forum.users;

import lombok.Getter;

import java.util.UUID;

@Getter
public class FavoriteQuestion {

    private final String id;
    private final String userId;
    private final String questionId;

    public FavoriteQuestion(String userId, String questionId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.questionId = questionId;
    }

}

