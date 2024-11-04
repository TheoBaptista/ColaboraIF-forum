package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.api_forum.notification.NotificationService;
import br.edu.ifrs.poa.api_forum.questions.answers.Answer;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerRequest;
import br.edu.ifrs.poa.api_forum.questions.cateogories.CategoryService;
import br.edu.ifrs.poa.api_forum.questions.topics.TopicService;
import br.edu.ifrs.poa.api_forum.users.UserService;
import com.mongodb.MongoCommandException;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.springframework.data.mongodb.core.query.Query.query;

@Service
@Slf4j
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CategoryService categoryService;
    private final MongoTemplate mongoTemplate;
    private final TopicService topicService;
    private final UserService userService;
    private final NotificationService notificationService;

    public QuestionService(QuestionRepository questionRepository, CategoryService categoryService, MongoTemplate mongoTemplate, TopicService topicService, UserService userService, NotificationService notificationService) {
        this.questionRepository = questionRepository;
        this.categoryService = categoryService;
        this.mongoTemplate = mongoTemplate;
        this.topicService = topicService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @PostConstruct
    public void init() {
        try {
            MongoDatabase database = mongoTemplate.getDb();
            MongoCollection<Document> collection = database.getCollection("questions");

            Document indexOptions = new Document();
            indexOptions.put("title", "text");
            indexOptions.put("content", "text");

            String indexResult = collection.createIndex(indexOptions);
            log.error("Índice criado: {}", indexResult);
        } catch (MongoCommandException e) {
            if (Objects.equals(e.getErrorCodeName(), "IndexOptionsConflict")) {
                log.error("Índice de texto já existe com uma configuração diferente.");
            } else {
                log.error("Erro ao criar índice: {}", e.getMessage());
            }
        }
    }

    public Question addQuestion(QuestionRequest questionRequest) {

        if (!categoryService.existsCategory(questionRequest.category())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria inválida.");
        }

        userService.getUser(questionRequest.userId());

        Question question = new Question(
                questionRequest.title(),
                questionRequest.content(),
                questionRequest.topic(),
                questionRequest.category(),
                questionRequest.userId(),
                questionRequest.username(),
                List.of()
        );

        val savedQuestion = questionRepository.save(question);
        topicService.addTopic(savedQuestion.getTopic());


        return savedQuestion;
    }

    public Question findById(String id) {
        val questionOptional = questionRepository.findById(id);

        if (questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Pergunta não encontrada.");
        }

        return questionOptional.get();
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question addAnswer(String questionId, AnswerRequest answerRequest) {

        userService.getUser(answerRequest.userId());

        Optional<Question> questionOptional = questionRepository.findById(questionId);

        if (questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Pergunta não encontrada.");
        }

        Question question = questionOptional.get();

        Answer answer = new Answer(
                answerRequest.content(),
                false,
                answerRequest.userId(),
                answerRequest.username()
        );

        question.getAnswers().add(answer);
        questionRepository.save(question);

        String message = "Nova resposta de " + answerRequest.username() + " para a pergunta que voce criou com título: " + question.getTitle();
        notificationService.notifyUser(questionId, message);

        return question;
    }

    public List<Question> searchQuestions(String query) {
        TextCriteria criteria = TextCriteria.forDefaultLanguage().matching(query);
        return mongoTemplate.find(
                query(criteria),
                Question.class
        );
    }

    // TODO: implementar deleção apenas do usúrio que criou a pergunta
    public void deleteQuestion(String id) {
        Optional<Question> questionOptional = questionRepository.findById(id);
        if (questionOptional.isPresent()) {
            Question question = questionOptional.get();
            if (question.getAnswers() != null && !question.getAnswers().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível excluir uma pergunta que já possui respostas.");
            }
            questionRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada.");
        }
    }

    public Question updateQuestion(String questionId, QuestionRequest questionRequest) {

        userService.getUser(questionRequest.userId());

        Question question = findQuestionByIdOrThrow(questionId);
        validateOwnership(question.getUserId(), questionRequest.userId());
        validateCategory(questionRequest.category());
        question.setTitle(questionRequest.title());
        question.setContent(questionRequest.content());
        question.setTopic(questionRequest.topic());
        question.setCategory(questionRequest.category());
        return questionRepository.save(question);
    }

    public Optional<Answer> markAnswerAsCorrect(String questionId, String answerId, String userId) {

        userService.getUser(userId);



        Question question = findQuestionByIdOrThrow(questionId);
        validateOwnership(question.getUserId(), userId);
        question.getAnswers().forEach(answer -> answer.setCorrectAnswer(false));
        Answer selectedAnswer = question.getAnswers().stream()
                .filter(answer -> answer.getId().equals(answerId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta não encontrada."));
        selectedAnswer.setCorrectAnswer(true);

        return questionRepository.save(question).getAnswers().stream().filter(Answer::isCorrectAnswer).findFirst();
    }

    private void validateCategory(String category) {
        if (!categoryService.existsCategory(category)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria inválida.");
        }
    }

    private void validateOwnership(String ownerId, String userId) {
        if (!ownerId.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Permissão negada: apenas o autor pode modificar a pergunta.");
        }
    }

    private Question findQuestionByIdOrThrow(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada."));
    }

}
