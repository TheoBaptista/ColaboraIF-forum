package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.questions.answers.Answer;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerRequest;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        Question savedQuestion = questionService.addQuestion(questionRequest);
        return new ResponseEntity<>(new QuestionResponse(savedQuestion), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> listQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionResponse> questionResponses = questions.stream()
                .map(QuestionResponse::new)
                .toList();
        return ResponseEntity.ok(questionResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable String id) {
        Question question = questionService.findById(id);
        return ResponseEntity.ok(new QuestionResponse(question));
    }

    @PostMapping("/{questionId}/answers")
    public ResponseEntity<QuestionResponse> addAnswer(@PathVariable String questionId, @RequestBody AnswerRequest answerRequest) {
        return ResponseEntity.ok(questionService.addAnswer(questionId, answerRequest));
    }

    @GetMapping("/search")
    public ResponseEntity<List<QuestionResponse>> searchQuestions(@RequestParam String q) {
        List<Question> questions = questionService.searchQuestions(q);
        List<QuestionResponse> questionResponses = questions.stream()
                .map(QuestionResponse::new)
                .toList();
        return ResponseEntity.ok(questionResponses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable String id, @RequestBody QuestionRequest questionRequest) {
        Question updatedQuestion = questionService.updateQuestion(id, questionRequest);
        return ResponseEntity.ok(new QuestionResponse(updatedQuestion));
    }

    @PatchMapping("/{questionId}/answers/{answerId}/correct")
    public ResponseEntity<AnswerResponse> markAnswerAsCorrect(
            @PathVariable String questionId,
            @PathVariable String answerId,
            @RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId");
        Optional<Answer> updatedAnswer = questionService.markAnswerAsCorrect(questionId, answerId, userId);

        if (updatedAnswer.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Apenas o autor da pergunta pode marcar como correta");
        }

        return ResponseEntity.ok(new AnswerResponse(updatedAnswer.get()));
    }
}
