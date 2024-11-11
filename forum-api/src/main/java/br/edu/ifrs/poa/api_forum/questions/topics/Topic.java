package br.edu.ifrs.poa.api_forum.questions.topics;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Locale;

@Data
@Document(collection = "topics")
public class Topic {

    @Id
    private String id;
    private String name;

    public Topic(String name) {
        this.name = name.toLowerCase(Locale.ROOT).trim();
    }

}
