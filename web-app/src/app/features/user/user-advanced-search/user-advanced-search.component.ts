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
  ],
  templateUrl: './user-advanced-search.component.html',
  styleUrl: './user-advanced-search.component.css',
})
export class UserAdvancedSearchComponent {
  searchForm: FormGroup;
  categories: string[] = [];

  constructor(private fb: FormBuilder, private questionService: QuestionService,  private snackBar: MatSnackBar) {
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
        this.categories = ['Todas as categorias', ...data];
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

  onSearch() {
    if (this.isValid()) {
      console.log(this.searchForm.value);
    } else {
      console.log('Preencha pelo menos o título ou a descrição.');
    }
  }
}
