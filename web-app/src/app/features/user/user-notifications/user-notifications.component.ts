import { Component } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthorizationService } from '../../../core/services/authorization.service';

@Component({
  selector: 'app-user-notifications',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule],
  templateUrl: './user-notifications.component.html',
  styleUrl: './user-notifications.component.css',
})
export class UserNotificationsComponent {
  notifications: any[] = [];

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private authService: AuthorizationService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.questionService.getUserNotifications(user.id).subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (error) => {
        console.error('Erro ao buscar notificações:', error);
      }
    });
  }

  onNotificationClick(notification: any): void {
    console.log('Notificação selecionada:', notification);
    this.questionService.deleteNotification(notification.userId, notification.id).subscribe(
      () => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notification.id
        );

        this.router.navigate(['/question', notification.questionId]);
      },
      (error) => {
        console.error('Erro ao deletar notificação:', error);
      }
    );
  }
}
