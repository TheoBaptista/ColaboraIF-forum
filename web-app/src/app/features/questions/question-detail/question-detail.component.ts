import { Component } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
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
}
