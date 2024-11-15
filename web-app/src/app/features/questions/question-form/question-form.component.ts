import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../core/services/question.service';
import { Question } from '../../../core/models/question.model';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { LineClampDirective } from '../../../shared/directives/line-clamp.directive';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css'],
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    LineClampDirective
  ],
})
export class QuestionFormComponent {
  questionForm: FormGroup;
  user: any = null;
  categories: string[] = [];
  allTopics: string[] = [];
  filteredTopics: string[] = [];
  suggestedQuestions: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    public router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthorizationService
  ) {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      category: ['', [Validators.required]],
      topic: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    });

    this.user = this.authService.getUserInfo();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit(): void {
    
    this.questionService.getCategories().subscribe({
      next: (data: string[]) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', {
          duration: 3000,
          panelClass: ['custom-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  onTitleInput(event: any): void {
    const title = event.target.value;
    if (title.length >= 4) {
      this.questionService.searchQuestions(title).subscribe({
        next: (questions: any[]) => {
          this.suggestedQuestions = questions;
        },
        error: (err) => {
          console.error('Erro ao buscar perguntas sugeridas', err);
        }
      });
    } else {
      this.suggestedQuestions = [];
    }
  }

  onTopicInput(event: any): void {
    const value = event.target.value;

    if (value.length < 3) {
        this.filteredTopics = [];
        return; 
    }

    this.questionService.getTopics(value).subscribe({
      next: (topics: string[]) => {
          this.filteredTopics = topics;
      },
      error: (err) => {
          console.error('Erro ao buscar tópicos semelhantes', err);
      }
  });
  }

  selectTopic(topic: string): void {
    this.questionForm.patchValue({ topic });
    this.filteredTopics = [];
  }

  viewQuestionDetails(id: string) {
    this.router.navigate([`/question/${id}`]);
  }

  insertCodeSnippet() {
    const currentDescription = this.questionForm.get('description')?.value || '';
    const codeSnippet = '```\n// Seu código aqui\n```';
    this.questionForm.get('description')?.setValue(currentDescription + '\n' + codeSnippet);
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const formData: Question = {
        title: this.questionForm.value.title,
        content: this.questionForm.value.description,
        topic: this.questionForm.value.topic,
        category: this.questionForm.value.category,
        user_id: this.user.id,
        username: this.user.name,
      };

      this.questionService.createQuestion(formData).subscribe({
        next: (response) => {
          console.log('Pergunta enviada com sucesso:', response);
          this.snackBar.open('Pergunta criada com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['custom-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/list']);
        },
        error: (err) => {
          console.error('Erro ao criar a pergunta', err);
          this.snackBar.open(
            'Erro ao atualizar a pergunta. Tente novamente.',
            'Fechar',
            {
              duration: 3000,
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
          this.router.navigate(['/list']);
        },
      });
    }
  }

  isValid(): boolean {
    return this.questionForm.valid;
  }

  onCancel() {
    this.router.navigate(['/list']);
  }
}
