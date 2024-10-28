package br.edu.ifrs.poa.api_forum.questions.topics;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping("/{name}")
    public ResponseEntity<List<String>> getTopicsByName(@PathVariable String name) {
        List<Topic> topic = topicService.getTopicsByName(name);

        return ResponseEntity.ok(topic.stream().map(Topic::getName).toList());
    }

}
