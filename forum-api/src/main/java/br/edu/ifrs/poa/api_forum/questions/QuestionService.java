package br.edu.ifrs.poa.api_forum.questions;

import br.edu.ifrs.poa.api_forum.questions.answers.Answer;
import br.edu.ifrs.poa.api_forum.questions.answers.AnswerRequest;
import br.edu.ifrs.poa.api_forum.questions.cateogories.CategoryService;
import br.edu.ifrs.poa.api_forum.questions.topics.TopicService;
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

    public QuestionService(QuestionRepository questionRepository, CategoryService categoryService, MongoTemplate mongoTemplate, TopicService topicService) {
        this.questionRepository = questionRepository;
        this.categoryService = categoryService;
        this.mongoTemplate = mongoTemplate;
        this.topicService = topicService;
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

    public Optional<Question> findById(String id) {
        return questionRepository.findById(id);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question addAnswer(String questionId, AnswerRequest answerRequest) {

        Optional<Question> questionOptional = questionRepository.findById(questionId);

        if (questionOptional.isPresent()) {
            Question question = questionOptional.get();

            Answer answer = new Answer(
                    answerRequest.content(),
                    false,
                    answerRequest.userId(),
                    answerRequest.username()
            );

            question.getAnswers().add(answer);
            return questionRepository.save(question);
        }
        return null;
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

    public Optional<Question> updateQuestion(String id, QuestionRequest questionRequest) {

        Optional<Question> questionOptional = questionRepository.findById(id);
        if (questionOptional.isPresent()) {

            Question question = questionOptional.get();

            if (!question.getUserId().equals(questionRequest.userId())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Permissão negada: apenas o autor pode editar a pergunta.");
            }

            if (categoryService.existsCategory(questionRequest.category())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria inválida.");
            }

            question.setTitle(questionRequest.title());
            question.setContent(questionRequest.content());
            question.setTopic(questionRequest.topic());
            question.setCategory(questionRequest.category());

            val savedQuestion = questionRepository.save(question);
            topicService.addTopic(savedQuestion.getTopic());

            return Optional.of(questionRepository.save(question));
        }
        return Optional.empty();
    }

    public boolean markAnswerAsCorrect(String questionId, String answerId, String userId) {
        Optional<Question> questionOptional = questionRepository.findById(questionId);

        if (questionOptional.isPresent()) {
            Question question = questionOptional.get();

            if (!question.getUserId().equals(userId)) {
                return false;
            }

            question.getAnswers().forEach(answer -> answer.setCorrectAnswer(false));

            Answer selectedAnswer = question.getAnswers().stream()
                    .filter(answer -> answer.getId().equals(answerId))
                    .findFirst()
                    .orElse(null);

            if (selectedAnswer != null) {
                selectedAnswer.setCorrectAnswer(true);
                questionRepository.save(question);
                return true;
            }
        }
        return false;
    }
}
