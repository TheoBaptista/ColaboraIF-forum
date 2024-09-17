import { Component } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = 'user123';

    this.questionService.getUserNotifications(userId).subscribe(
      (data) => {
        this.notifications = data;
      },
      (error) => {
        console.error('Erro ao buscar notificações:', error);
      }
    );
  }

  onNotificationClick(notification: any): void {
    this.questionService.deleteNotification(notification.id).subscribe(
      () => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notification.id
        );

        this.router.navigate(['/question', notification.question_id]);
      },
      (error) => {
        console.error('Erro ao deletar notificação:', error);
      }
    );
  }
}
