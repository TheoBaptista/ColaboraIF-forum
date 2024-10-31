package br.edu.ifrs.poa.api_forum.users;

import lombok.Getter;

import java.util.UUID;

@Getter
public class Notification {

    private final String id;
    private final String userId;
    private final String message;
    private final String questionId;
    private boolean hasRead;

    public Notification(String userId, String message, String questionId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.message = message;
        this.questionId = questionId;
        this.hasRead = false;
    }

    public void markAsRead() {
        this.hasRead = true;
    }

}
