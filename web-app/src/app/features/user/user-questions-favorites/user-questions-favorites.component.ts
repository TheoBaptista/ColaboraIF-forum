import { Component } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuestionResponse } from '../../../core/models/question.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-questions-favorites',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatInputModule, MatIconModule],
  templateUrl: './user-questions-favorites.component.html',
  styleUrl: './user-questions-favorites.component.css',
})
export class UserQuestionsFavoritesComponent {
  questions: QuestionResponse[] = [];
  questionHavesCorrectAnswer = false;

  constructor(
    private router: Router,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    const userId = 'user123';
    this.loadQuestionsFavoriteByUser(userId);
  }

  loadQuestionsFavoriteByUser(userId: string) {
    this.questionService.getFavoriteQuestionsOfUser(userId).subscribe({
      next: (data: QuestionResponse[]) => {
        this.questions = this.initializeAnswers(data);
        this.questionHavesCorrectAnswer = this.questions.some(
          (question) =>
            Array.isArray(question.answers) &&
            question.answers.some((answer) => answer?.is_correct_answer)
        );
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

  viewQuestionDetails(id: string) {
    this.router.navigate([`/question/${id}`]);
  }
}
