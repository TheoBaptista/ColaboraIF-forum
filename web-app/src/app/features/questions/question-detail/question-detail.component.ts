import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { Answer, QuestionResponse } from '../../../core/models/question.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AnswerDialogComponent } from '../../../shared/answer-dialog/answer-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
  ],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css'],
})
export class QuestionDetailComponent {
  question: QuestionResponse | null = null;
  newAnswerContent: string = '';
  questions = [];
  favoriteQuestions: string[] = [];
  userId = 'user123';


  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {

      this.loadFavoriteQuestions();

      this.questionService.getQuestionById(id).subscribe({
        next: (data: QuestionResponse) => {
          this.question = data;
        },
        error: (err) => {
          console.error('Erro ao carregar os detalhes da questão', err);
        },
      });

     
    }
  }

  loadFavoriteQuestions() {
    this.questionService.getFavoriteQuestionsInfo(this.userId).subscribe((favorites) => {
      this.favoriteQuestions = favorites;
    });
  }

  isFavorite(questionId: string): boolean {
    return this.favoriteQuestions.includes(questionId);
  }

  toggleFavorite(questionId: string) {
    if (this.isFavorite(questionId)) {
      // Se já é favorito, remove
      this.questionService.removeFavorite(this.userId, questionId).subscribe(() => {
        this.favoriteQuestions = this.favoriteQuestions.filter(id => id !== questionId);
      });
    } else {
      // Se não é favorito, adiciona
      this.questionService.addFavorite(this.userId, questionId).subscribe(() => {
        this.favoriteQuestions.push(questionId);
      });
    }
  }

  openAnswerDialog(): void {
    const dialogRef = this.dialog.open(AnswerDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Resposta enviada:', result);
        this.addAnswer(result);
      }
    });
  }

  addAnswer(answerContent: string) {
    if (!answerContent.trim()) {
      return;
    }

    const newAnswer: Answer = {
      id: '',
      content: answerContent,
      is_correct_answer: false,
      user_id: '12345',
      username: 'Maria',
    };

    const questionId = this.question?.id;

    if (questionId) {
      this.questionService.addAnswer(questionId, newAnswer).subscribe({
        next: (response) => {
          if (this.question) {
            this.question.answers.push(response);
          }
          this.newAnswerContent = '';
        },
        error: (err) => {
          console.error('Erro ao adicionar a resposta', err);
        },
      });
    }
  }

  isQuestionOwner(): boolean {
    const loggedUserId = this.getLoggedUserId();
    return this.question?.user_id === loggedUserId;
  }

  markAnswerAsCorrect(answerId: string) {
    const userId = this.getLoggedUserId();
    const questionId = this.question?.id;

    if (!questionId || !userId) {
      return;
    }

    this.questionService
      .markAnswerAsCorrect(questionId, answerId, userId)
      .subscribe({
        next: (updatedAnswer) => {
          this.question?.answers.forEach((answer) => {
            answer.is_correct_answer = answer.id === answerId;
          });
        },
        error: (err) => {
          console.error('Erro ao marcar a resposta como correta', err);
        },
      });
  }

  getLoggedUserId(): string | null {
    return 'user789';
  }
}
