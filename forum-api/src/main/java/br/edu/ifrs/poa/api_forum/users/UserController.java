package br.edu.ifrs.poa.api_forum.users;

import br.edu.ifrs.poa.api_forum.questions.Question;
import br.edu.ifrs.poa.api_forum.questions.QuestionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user-questions")
    public ResponseEntity<List<QuestionResponse>> getUserQuestions(@RequestParam String userId) {
        return ResponseEntity.ok(userService.getUserQuestions(userId));
    }


    @GetMapping("/user")
    public ResponseEntity<User> getUser(@RequestParam String userId) {
        User user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }


    @PostMapping("/favorite-questions")
    public ResponseEntity<FavoriteQuestionResponse> addFavoriteQuestion(@RequestBody FavoriteQuestionRequest request) {
        return ResponseEntity.ok(userService.addFavoriteQuestion(request.userId(), request.questionId()));
    }

    @DeleteMapping("/favorite-questions")
    public ResponseEntity<String> removeFavoriteQuestion(@RequestParam String userId, @RequestParam String questionId) {
        userService.removeFavoriteQuestion(userId, questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorite-questions")
    public ResponseEntity<List<String>> getFavoriteQuestionIds(@RequestParam String userId) {
        List<String> favoriteQuestionIds = userService.getFavoriteQuestionIds(userId);
        return ResponseEntity.ok(favoriteQuestionIds);
    }

    @GetMapping("/user/favorite-questions")
    public ResponseEntity<List<QuestionResponse>> getFavoriteQuestions(@RequestParam String userId) {
        return ResponseEntity.ok(userService.getFavoriteQuestions(userId));
    }

}
