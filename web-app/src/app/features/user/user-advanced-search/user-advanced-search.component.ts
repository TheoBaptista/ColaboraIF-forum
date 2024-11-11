import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuestionService } from '../../../core/services/question.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionResponse } from '../../../core/models/question.model';
import { Router } from '@angular/router';
import { LineClampDirective } from '../../../shared/directives/line-clamp.directive';

@Component({
  selector: 'app-user-advanced-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    LineClampDirective
  ],
  templateUrl: './user-advanced-search.component.html',
  styleUrl: './user-advanced-search.component.css',
})
export class UserAdvancedSearchComponent {
  searchForm: FormGroup;
  categories: string[] = [];
  questions: QuestionResponse[] | null = null;

  constructor(private fb: FormBuilder, private router: Router,private questionService: QuestionService,  private snackBar: MatSnackBar) {
    this.searchForm = this.fb.group({
      titleOrDescription: ['', [Validators.required, Validators.minLength(3)]], // Required validation
      topic: [''],
      category: ['', Validators.required],
      hasAnswers: [''],
      isSolved: [''],
    });
  }

  ngOnInit(): void {
    
    this.questionService.getCategories().subscribe({
      next: (data: string[]) => {
        this.categories = ['Todas as Categorias', ...data];
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

  isValid(): boolean {
    return this.searchForm.valid;
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

  hasCorrectAnswer(question: any): boolean {
    return question.answers.length > 0 && question.answers.some((answer: any) => answer.is_correct_answer);
  }

  onSearch() {
    if (this.isValid()) {
      const filters = this.searchForm.value;

      if (filters.category === 'Todas as Categorias') {
        filters.category = '';
      }

      this.questionService.advancedSearch(filters).subscribe({
        next: (questions) => {
          this.questions = questions;
        },
        error: (err) => {
          console.error('Erro ao buscar perguntas', err);
          this.questions = [];
          if (err.status === 404) {
            this.snackBar.open('Nenhuma pergunta encontrada.', 'Fechar', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('Erro ao buscar perguntas.', 'Fechar', {
              duration: 3000,
            });
          }
        }
      });
    } else {
      this.snackBar.open('Preencha o título ou a descrição e a categoria.', 'Fechar', {
        duration: 3000,
      });
    }
  }
}
