package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.questions.answers.AnswerRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(@RequestBody QuestionRequest questionRequest) {
        Question savedQuestion = questionService.addQuestion(questionRequest);

        QuestionResponse questionResponse = new QuestionResponse(savedQuestion);

        return new ResponseEntity<>(questionResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> listQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionResponse> questionResponses = questions.stream()
                .map(QuestionResponse::new)
                .toList();

        return new ResponseEntity<>(questionResponses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable String id) {
        Optional<Question> question = questionService.findById(id);
        if (question.isPresent()) {
            QuestionResponse questionResponse = new QuestionResponse(question.get());
            return ResponseEntity.ok(questionResponse);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/answers")
    public ResponseEntity<?> addAnswer(@PathVariable String id, @RequestBody AnswerRequest answerRequest) {

        Question updatedQuestion = questionService.addAnswer(id, answerRequest);

        if (updatedQuestion != null) {
            return ResponseEntity.ok(updatedQuestion);
        }
        return ResponseEntity.notFound().build();
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
        Optional<Question> updatedQuestion = questionService.updateQuestion(id, questionRequest);
        return updatedQuestion.map(question -> ResponseEntity.ok(new QuestionResponse(question)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{questionId}/answers/{answerId}/correct")
    public ResponseEntity<String> markAnswerAsCorrect(
            @PathVariable String questionId,
            @PathVariable String answerId,
            @RequestBody Map<String, String> requestBody) {

        String userId = requestBody.get("userId");
        boolean result = questionService.markAnswerAsCorrect(questionId, answerId, userId);

        if (result) {
            return ResponseEntity.ok("Answer marked as correct.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only the user who created the question can mark an answer as correct.");
        }
    }

}
