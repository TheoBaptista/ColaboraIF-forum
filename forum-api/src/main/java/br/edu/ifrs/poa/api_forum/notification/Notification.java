package br.edu.ifrs.poa.api_forum.notification;

import lombok.Data;

import java.util.UUID;

@Data
public class Notification {

    private String id;
    private String userId;
    private String message;
    private String questionId;
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
