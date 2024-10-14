import { Component } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuestionResponse } from '../../../core/models/question.model';
import { Router } from '@angular/router';
import { LineClampDirective } from '../../../shared/directives/line-clamp.directive';
import { AuthorizationService } from '../../../core/services/authorization.service';

@Component({
  selector: 'app-user-questions-favorites',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatInputModule, MatIconModule, LineClampDirective],
  templateUrl: './user-questions-favorites.component.html',
  styleUrl: './user-questions-favorites.component.css',
})
export class UserQuestionsFavoritesComponent {
  questions: QuestionResponse[] = [];

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private authService: AuthorizationService
  ) {}

  ngOnInit() {
    const user = this.authService.getUserInfo();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadQuestionsFavoriteByUser(user.id);
  }

  loadQuestionsFavoriteByUser(userId: string) {
    this.questionService.getFavoriteQuestionsOfUser(userId).subscribe({
      next: (data: QuestionResponse[]) => {
        this.questions = this.initializeAnswers(data);
      },

      error: (err) => {
        console.error('Erro ao carregar a lista de questões do usuário', err);
      },
    });
  }

  initializeAnswers(questions: QuestionResponse[]): QuestionResponse[] {
    return questions.map((question) => ({
      ...question,
      answers: question.answers ?? [],
    }));
  }

  hasCorrectAnswer(question: any): boolean {
    return question.answers.length > 0 && question.answers.some((answer: any) => answer.is_correct_answer);
  }

  viewQuestionDetails(id: string) {
    this.router.navigate([`/question/${id}`]);
  }
}
