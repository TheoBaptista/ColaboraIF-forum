package br.edu.ifrs.poa.api_forum.users;

import br.edu.ifrs.poa.api_forum.notification.Notification;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String email;
    private String name;
    private List<Notification> notifications;
    private List<FavoriteQuestion> favoriteQuestions;

    public User(String email, String name) {
        this.email = email;
        this.name = name;
        this.notifications = new ArrayList<>();
        this.favoriteQuestions = new ArrayList<>();
    }

    public void addNotification(Notification notification) {
        notifications.add(notification);
    }

    public void addFavoriteQuestion(FavoriteQuestion question) {
        favoriteQuestions.add(question);
    }

}
