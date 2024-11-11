package br.edu.ifrs.poa.api_forum.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/{userId}/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String userId,@PathVariable String notificationId) {
        notificationService.deleteNotification(notificationId, userId);
        return ResponseEntity.noContent().build();
    }
}
