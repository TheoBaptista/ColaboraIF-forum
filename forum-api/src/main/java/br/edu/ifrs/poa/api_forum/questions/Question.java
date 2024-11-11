package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.questions.answers.Answer;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.Locale;

@Data
@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    @TextIndexed
    private String title;

    @TextIndexed
    private String content;

    private String topic;
    private String category;
    private String userId;
    private String username;
    private boolean isSolved;
    private List<Answer> answers;


    public Question(String title, String content, String topic, String category, String userId, String username, List<Answer> answers) {
        this.title = title;
        this.content = content;
        this.topic = topic.toLowerCase(Locale.ROOT).trim();
        this.category = category;
        this.userId = userId;
        this.username = username;
        this.answers = answers;
        this.isSolved = false;
    }
}
