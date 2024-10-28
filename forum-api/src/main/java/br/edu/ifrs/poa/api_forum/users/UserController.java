package br.edu.ifrs.poa.api_forum.users;

import br.edu.ifrs.poa.api_forum.questions.Question;
import br.edu.ifrs.poa.api_forum.questions.QuestionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user-questions")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getUserQuestions(@RequestParam String userId) {
        List<Question> questions = userService.getUserQuestions(userId);
        List<QuestionResponse> response = questions.stream().map(QuestionResponse::new).toList();
        return ResponseEntity.ok(response);
    }

}
