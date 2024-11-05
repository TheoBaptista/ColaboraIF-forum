package br.edu.ifrs.poa.api_forum.questions.topics;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TopicRepository extends MongoRepository<Topic, String> {

    List<Topic> findByNameRegexIgnoreCase(String name);

    Optional<Topic> findByName(String name);

}
