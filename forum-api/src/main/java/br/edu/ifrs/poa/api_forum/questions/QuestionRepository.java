package br.edu.ifrs.poa.api_forum.questions;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {

    List<Question> findByUserId(String userId);

}
