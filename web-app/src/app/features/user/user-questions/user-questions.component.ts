import { Component, OnInit } from '@angular/core';
import { QuestionResponse } from '../../../core/models/question.model';
import { QuestionService } from '../../../core/services/question.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-questions',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './user-questions.component.html',
  styleUrl: './user-questions.component.css',
})
export class UserQuestionsComponent implements OnInit {
  questions: QuestionResponse[] = [];
  questionHavesCorrectAnswer = false;

  constructor(
    private questionService: QuestionService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) //private authService: AuthService
  {}

  ngOnInit() {
    //const userId = this.authService.getUserId();

    const userId = 'user123';
    this.loadQuestions(userId);
  }

  loadQuestions(userId: string) {
    this.questionService.getUserQuestions(userId).subscribe({
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

  initializeAnswers(questions: QuestionResponse[]): QuestionResponse[] {
    return questions.map((question) => ({
      ...question,
      answers: question.answers ?? [],
    }));
  }

  confirmDelete(question: QuestionResponse): void {
    if (question.answers.length > 0) {
      this.snackBar.open('Esta pergunta não pode ser excluída, pois já possui respostas.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteQuestion(question.id);
      }
    });
  }

  deleteQuestion(questionId: string): void {
    this.questionService.deleteQuestion(questionId).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id !== questionId);
        this.snackBar.open('Pergunta excluída com sucesso.', 'Fechar', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Erro ao excluir a pergunta.', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  editQuestion(questionId: string): void {
    this.router.navigate(['/user/edit-question/', questionId]);
  }
}
