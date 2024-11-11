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
import { LineClampDirective } from '../../../shared/directives/line-clamp.directive';
import { AuthorizationService } from '../../../core/services/authorization.service';

@Component({
  selector: 'app-user-questions',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatSnackBarModule,
    LineClampDirective
  ],
  templateUrl: './user-questions.component.html',
  styleUrl: './user-questions.component.css',
})
export class UserQuestionsComponent implements OnInit {
  questions: QuestionResponse[] = [];
 
  constructor(
    private questionService: QuestionService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthorizationService
  ) {}

  ngOnInit() {
    const user = this.authService.getUserInfo();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadQuestions(user.id);
  }

  loadQuestions(userId: string) {
    this.questionService.getUserQuestions(userId).subscribe({
      next: (data: QuestionResponse[]) => {
        this.questions = this.initializeAnswers(data);
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
      this.snackBar.open(
        'Esta pergunta não pode ser excluída, pois já possui respostas.',
        'Fechar',
        {
          duration: 3000,
        }
      );
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

    const user = this.authService.getUserInfo();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.questionService.deleteQuestion(questionId, user.id).subscribe({
      next: () => {
        this.questions = this.questions.filter((q) => q.id !== questionId);
        this.snackBar.open('Pergunta excluída com sucesso.', 'Fechar', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Erro ao excluir a pergunta.', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  createNewQuestion(): void {
    this.router.navigate(['/form']);
  }

  hasCorrectAnswer(question: any): boolean {
    return question.answers.length > 0 && question.answers.some((answer: any) => answer.is_correct_answer);
  }

  editQuestion(questionId: string): void {
    this.router.navigate(['/user/edit-question/', questionId]);
  }
}
