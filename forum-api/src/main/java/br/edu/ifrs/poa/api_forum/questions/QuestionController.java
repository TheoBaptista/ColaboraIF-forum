package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.questions.answers.AnswerRequest;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(@RequestBody QuestionRequest questionRequest) {
        QuestionResponse savedQuestion = questionService.addQuestion(questionRequest);
        return new ResponseEntity<>(savedQuestion, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> listQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable String id) {
        return ResponseEntity.ok(questionService.findById(id));
    }

    @PostMapping("/{questionId}/answers")
    public ResponseEntity<QuestionResponse> addAnswer(@PathVariable String questionId, @RequestBody AnswerRequest answerRequest) {
        return ResponseEntity.ok(questionService.addAnswer(questionId, answerRequest));
    }

    @GetMapping("/search")
    public ResponseEntity<List<QuestionResponse>> searchQuestions(@RequestParam String q) {
        return ResponseEntity.ok(questionService.searchQuestions(q));
    }

    @GetMapping("/advanced-search")
    public ResponseEntity<List<QuestionResponse>> advancedSearch(
            @RequestParam String titleOrDescription,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean hasAnswers,
            @RequestParam(required = false) Boolean isSolved) {
        return ResponseEntity.ok(questionService.advancedSearch(titleOrDescription, topic, category, hasAnswers, isSolved));
    }

    @DeleteMapping("/{id}/{userId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id, @PathVariable String userId) {
        questionService.deleteQuestion(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable String id, @RequestBody QuestionRequest questionRequest) {
        return ResponseEntity.ok(questionService.updateQuestion(id, questionRequest));
    }

    @PatchMapping("/{questionId}/answers/{answerId}/correct")
    public ResponseEntity<AnswerResponse> markAnswerAsCorrect(
            @PathVariable String questionId,
            @PathVariable String answerId,
            @RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId");
        return ResponseEntity.ok(questionService.markAnswerAsCorrect(questionId, answerId, userId));
    }
}
