import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { Answer, QuestionResponse } from '../../../core/models/question.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AnswerDialogComponent } from '../../../shared/answer-dialog/answer-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { MarkdownModule } from 'ngx-markdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MarkdownModule
  ],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css'],
})
export class QuestionDetailComponent {
  question: QuestionResponse | null = null;
  newAnswerContent: string = '';
  questions = [];
  favoriteQuestions: string[] = [];
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private dialog: MatDialog,
    private authService: AuthorizationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.user = this.authService.getUserInfo();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFavoriteQuestions();
      this.loadQuestionDetails(id);
    }
  }

  processContent(content: string): SafeHtml {
    if (!content) {
      return '';
    }
  
    const codeRegex = /```([\s\S]*?)```/g;
    const sanitizedContent = content.replace(codeRegex, '<div class="code-container" style="max-width: 100% !important; background-color: #2e2e2e !important; color: #ff7f50 !important; padding: 16px !important; border-radius: 4px !important; overflow-x: auto !important; box-sizing: border-box;  white-space: pre-wrap;"><pre><code>$1</code></pre></div>');
  
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedContent);
  }

  loadFavoriteQuestions() {
    this.questionService
      .getFavoriteQuestionsInfo(this.user.id)
      .subscribe((favorites) => {
        this.favoriteQuestions = favorites;
      });
  }

  isFavorite(questionId: string): boolean {
    return this.favoriteQuestions.includes(questionId);
  }

  loadQuestionDetails(id: string) {
    this.questionService.getQuestionById(id).subscribe({
      next: (data: QuestionResponse) => {
        this.question = data;
      },
      error: (err) => {
        console.error('Erro ao carregar os detalhes da questão', err);
      },
    });
  }

  toggleFavorite(questionId: string) {
    if (this.isFavorite(questionId)) {
      
      this.questionService
        .removeFavorite(this.user.id, questionId)
        .subscribe(() => {
          this.favoriteQuestions = this.favoriteQuestions.filter(
            (id) => id !== questionId
          );
        });
    } else {
      
      this.questionService
        .addFavorite(this.user.id, questionId)
        .subscribe(() => {
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
      content: answerContent,
      is_correct_answer: false,
      user_id: this.user.id,
      username: this.user.name,
    };

    const questionId = this.question?.id;

    if (questionId) {
      this.questionService.addAnswer(questionId, newAnswer).subscribe({
        next: () => {
          this.loadQuestionDetails(questionId); // Recarrega a pergunta
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
    return  this.user.id;
  }
}
