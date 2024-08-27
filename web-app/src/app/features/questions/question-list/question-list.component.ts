import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { QuestionResponse } from '../../../core/models/question.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css',
})
export class QuestionListComponent {
  questions: QuestionResponse[] = [];
  questionHavesCorrectAnswer = false;
  questionsResponseCount = 0;

  constructor(
    private router: Router,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.questionService.listQuestions().subscribe({
      next: (data: QuestionResponse[]) => {
        this.questions = this.initializeAnswers(data);
        this.questionHavesCorrectAnswer = this.questions.some(
          (question) =>
            Array.isArray(question.answers) &&
            question.answers.some((answer) => answer?.is_correct_answer)
        );
      },

      error: (err) => {
        console.error('Erro ao carregar a lista de questões', err);
      },
    });
  }

  goToQuestionForm() {
    this.router.navigate(['/form']);
  }

  viewQuestionDetails(id: string) {
    this.router.navigate([`/question/${id}`]);
  }

  initializeAnswers(questions: QuestionResponse[]): QuestionResponse[] {
    return questions.map((question) => ({
      ...question,
      answers: question.answers ?? [],
    }));
  }
}
