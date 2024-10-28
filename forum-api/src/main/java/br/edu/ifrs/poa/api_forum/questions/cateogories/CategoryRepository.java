package br.edu.ifrs.poa.api_forum.questions.cateogories;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {

    boolean existsByName(String name);

}
