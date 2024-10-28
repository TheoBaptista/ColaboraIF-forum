package br.edu.ifrs.poa.api_forum.questions.cateogories;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "categories")
public class Category {

    @Id
    private String id;
    private String name;

    public Category(String name) {
        this.name = name;
    }

}
