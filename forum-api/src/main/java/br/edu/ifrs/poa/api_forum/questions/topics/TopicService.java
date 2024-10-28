package br.edu.ifrs.poa.api_forum.questions.topics;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class TopicService {

    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    public List<Topic> getTopicsByName(String name) {

        name = name.trim().toLowerCase(Locale.ROOT);

        if (name.length() < 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O termo de busca deve ter pelo menos 3 caracteres.");
        }

        String regex = "^" + name + ".*";
        return topicRepository.findByNameRegexIgnoreCase(regex);
    }

    public void addTopic(String topic) {
        topicRepository.save(new Topic(topic));
    }

}
