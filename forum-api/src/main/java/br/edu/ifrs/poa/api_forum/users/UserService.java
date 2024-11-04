package br.edu.ifrs.poa.api_forum.users;

import br.edu.ifrs.poa.api_forum.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.api_forum.questions.Question;
import br.edu.ifrs.poa.api_forum.questions.QuestionRepository;
import br.edu.ifrs.poa.api_forum.questions.QuestionResponse;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public UserService(QuestionRepository questionRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    public List<QuestionResponse> getUserQuestions(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }

        User user = userOpt.get();
        val questionList = questionRepository.findByUserId(user.getId());
        return questionList.stream().map(QuestionResponse::new).toList();
    }

    public FavoriteQuestionResponse addFavoriteQuestion(String userId, String questionId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }

        User user = userOpt.get();

        if (user.getFavoriteQuestions().stream().anyMatch(fav -> fav.getQuestionId().equals(questionId))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Essa pergunta já está nos favoritos");
        }

        Optional<Question> questionOpt = questionRepository.findById(questionId);
        if (questionOpt.isEmpty()) {
            throw new ResourceNotFoundException("Pergunta não encontrada");
        }
        Question question = questionOpt.get();

        FavoriteQuestion newFavorite = new FavoriteQuestion(userId, question.getId());
        user.addFavoriteQuestion(newFavorite);
        userRepository.save(user);
        return new FavoriteQuestionResponse(newFavorite);
    }

    public void removeFavoriteQuestion(String userId, String questionId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }

        User user = userOpt.get();
        List<FavoriteQuestion> favorites = user.getFavoriteQuestions();

        boolean removed = favorites.removeIf(fav -> fav.getQuestionId().equals(questionId));

        if (!removed) {
            throw new ResourceNotFoundException("Pergunta favorita não econtrada no usuário");
        }

        userRepository.save(user);
    }

    public List<String> getFavoriteQuestionIds(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }

        return userOpt.get().getFavoriteQuestions()
                .stream()
                .map(FavoriteQuestion::getQuestionId)
                .toList();
    }

    public List<QuestionResponse> getFavoriteQuestions(String userId) {
        List<String> favoriteQuestionIds = getFavoriteQuestionIds(userId);

        return questionRepository.findAllById(favoriteQuestionIds).stream().map(QuestionResponse::new).toList();
    }

    public User getUser(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Usário não encontrado"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
