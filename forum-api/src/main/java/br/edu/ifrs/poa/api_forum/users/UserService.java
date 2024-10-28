package br.edu.ifrs.poa.api_forum.users;

import br.edu.ifrs.poa.api_forum.questions.Question;
import br.edu.ifrs.poa.api_forum.questions.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final QuestionRepository questionRepository;

    public UserService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getUserQuestions(String userId) {
        return questionRepository.findByUserId(userId);
    }

}
