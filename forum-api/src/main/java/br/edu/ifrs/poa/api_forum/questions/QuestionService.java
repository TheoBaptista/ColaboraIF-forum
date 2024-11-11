package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.api_forum.notification.NotificationService;
import br.edu.ifrs.poa.api_forum.questions.answers.Answer;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerRequest;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerResponse;
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
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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

    public QuestionResponse addQuestion(QuestionRequest questionRequest) {

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


        return new QuestionResponse(savedQuestion);
    }

    public QuestionResponse findById(String id) {
        val questionOptional = questionRepository.findById(id);

        if (questionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Pergunta não encontrada.");
        }

        return new QuestionResponse(questionOptional.get());
    }

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream().map(QuestionResponse::new).toList();
    }

    public QuestionResponse addAnswer(String questionId, AnswerRequest answerRequest) {

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

        return new QuestionResponse(question);
    }

    public List<QuestionResponse> searchQuestions(String query) {
        TextCriteria criteria = TextCriteria.forDefaultLanguage().matching(query);
        List<Question> questions = mongoTemplate.find(
                query(criteria),
                Question.class
        );
        return questions.stream().map(QuestionResponse::new).toList();
    }

    public List<QuestionResponse> advancedSearch(String titleOrDescription, String topic, String category, Boolean hasAnswers, Boolean isSolved) {
        Query query = new Query();

        Criteria titleOrDescriptionCriteria = new Criteria().orOperator(
                Criteria.where("title").regex(titleOrDescription, "i"),
                Criteria.where("content").regex(titleOrDescription, "i")
        );
        query.addCriteria(titleOrDescriptionCriteria);

        if (topic != null && !topic.isBlank()) {
            query.addCriteria(Criteria.where("topic").is(topic.toLowerCase().trim()));
        }

        if (category != null && !category.isBlank()) {
            query.addCriteria(Criteria.where("category").is(category));
        }

        val questionList = mongoTemplate.find(query, Question.class);

        if (questionList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma pergunta encontrada.");
        }

        hasAnswersFilter(hasAnswers, questionList);

        isSolvedFilter(isSolved, questionList);

        return questionList.stream().map(QuestionResponse::new).toList();
    }

    public void deleteQuestion(String id, String userId) {
        Optional<Question> questionOptional = questionRepository.findById(id);

        userService.getUser(userId);

        if (questionOptional.isPresent()) {

            Question question = questionOptional.get();

            validateOwnership(question.getUserId(), userId);

            if (question.getAnswers() != null && !question.getAnswers().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível excluir uma pergunta que já possui respostas.");
            }

            questionRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada.");
        }
    }

    public QuestionResponse updateQuestion(String questionId, QuestionRequest questionRequest) {

        userService.getUser(questionRequest.userId());

        Question question = findQuestionByIdOrThrow(questionId);
        validateOwnership(question.getUserId(), questionRequest.userId());
        validateCategory(questionRequest.category());
        question.setTitle(questionRequest.title());
        question.setContent(questionRequest.content());
        question.setTopic(questionRequest.topic());
        question.setCategory(questionRequest.category());

        Question updatedQuestion = questionRepository.save(question);
        return new QuestionResponse(updatedQuestion);
    }

    public AnswerResponse markAnswerAsCorrect(String questionId, String answerId, String userId) {

        userService.getUser(userId);

        Question question = findQuestionByIdOrThrow(questionId);
        validateOwnership(question.getUserId(), userId);
        question.getAnswers().forEach(answer -> answer.setCorrectAnswer(false));
        Answer selectedAnswer = question.getAnswers().stream()
                .filter(answer -> answer.getId().equals(answerId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta não encontrada."));
        selectedAnswer.setCorrectAnswer(true);

        question.setSolved(true);

        Optional<Answer> updatedAnswer = questionRepository.save(question).getAnswers().stream().filter(Answer::isCorrectAnswer).findFirst();

        if (updatedAnswer.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Apenas o autor da pergunta pode marcar como correta");
        }

        return new AnswerResponse(updatedAnswer.get());
    }

    private void isSolvedFilter(Boolean isSolved, List<Question> questionList) {
        if (isSolved != null) {
            if (isSolved) {
                questionList.removeIf(question -> !question.isSolved());
            } else {
                questionList.removeIf(Question::isSolved);
            }
        }
    }

    private void hasAnswersFilter(Boolean hasAnswers, List<Question> questionList) {
        if (hasAnswers != null) {
            if (hasAnswers){
                questionList.removeIf(question -> question.getAnswers() == null || question.getAnswers().isEmpty());
            }else{
                questionList.removeIf(question -> question.getAnswers() != null && !question.getAnswers().isEmpty());
            }
        }
    }

    private void validateCategory(String category) {
        if (!categoryService.existsCategory(category)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria inválida.");
        }
    }

    private void validateOwnership(String ownerId, String userId) {
        if (!ownerId.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Permissão negada: apenas o autor pode modificar a pergunta.");
        }
    }

    private Question findQuestionByIdOrThrow(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada."));
    }

}
