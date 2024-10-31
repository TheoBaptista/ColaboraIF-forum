package br.edu.ifrs.poa.api_forum.users;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private final String email;
    private final String name;
    private final List<Notification> notifications;
    private final List<FavoriteQuestion> favoriteQuestions;


    public User(String email, String name) {
        this.email = email;
        this.name = name;
        this.notifications = new ArrayList<>();
        this.favoriteQuestions = new ArrayList<>();
    }

    public void addNotification(Notification notification) {
        notifications.add(notification);
    }

    public void removeNotification(Notification notification) {
        notifications.remove(notification);
    }

    public void addFavoriteQuestion(FavoriteQuestion question) {
        favoriteQuestions.add(question);
    }

    public void removeFavoriteQuestion(FavoriteQuestion question) {
        favoriteQuestions.remove(question);
    }

}
