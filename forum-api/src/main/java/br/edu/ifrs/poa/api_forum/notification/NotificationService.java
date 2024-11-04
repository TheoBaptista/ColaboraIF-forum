package br.edu.ifrs.poa.api_forum.notification;

import br.edu.ifrs.poa.api_forum.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.api_forum.questions.Question;
import br.edu.ifrs.poa.api_forum.questions.QuestionRepository;
import br.edu.ifrs.poa.api_forum.users.User;
import br.edu.ifrs.poa.api_forum.users.UserRepository;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final UserRepository userRepository;

    //private final JavaMailSender mailSender;

    private final QuestionRepository questionRepository;

    public NotificationService(UserRepository userRepository, QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }

    public void notifyUser(String questionId, String message) {
        Optional<Question> questionOptional = questionRepository.findById(questionId);

        if (questionOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada.");
        }

        Question question = questionOptional.get();
        String ownerId = question.getUserId();
        Optional<User> userOptional = userRepository.findById(ownerId);

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
        }

        val user = userOptional.get();

        Notification notification = new Notification(user.getId(), message, questionId);

        user.addNotification(notification);

        userRepository.save(user);

        //sendEmailNotification(userOptional.get().getEmail(), message, questionId);
    }

//    private void sendEmailNotification(String recipientEmail, String message, String questionId) {
//        try {
//            MimeMessage mail = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(mail, true);
//            helper.setTo(recipientEmail);
//            helper.setSubject("Nova resposta na sua pergunta");
//
//            String emailContent = "<p>Você recebeu uma nova resposta:</p>" +
//                    "<p>" + message + "</p>" +
//                    "<p><a href='https://seusite.com/questions/" + questionId + "'>Ver pergunta</a></p>";
//
//            helper.setText(emailContent, true);
//
//            mailSender.send(mail);
//        } catch (MessagingException e) {
//            throw new RuntimeException("Falha ao enviar e-mail: " + e.getMessage());
//        }
//    }

    public List<Notification> getUserNotifications(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
        }

        return userOptional.get().getNotifications();
    }

    public void deleteNotification(String notificationId, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
        }

        User user = userOptional.get();

        Optional<Notification> notificationOptional = user.getNotifications().stream()
                .filter(notification -> notification.getId().equals(notificationId))
                .findFirst();

        if (notificationOptional.isEmpty()) {
            throw new ResourceNotFoundException("Notificação não encontrada.");
        }

        user.getNotifications().remove(notificationOptional.get());

        userRepository.save(user);
    }
}
