import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { QuestionResponse } from '../../../core/models/question.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { AuthorizationService } from '../../../core/services/authorization.service';

@Component({
  selector: 'app-user-question-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-question-edit.component.html',
  styleUrls: ['./user-question-edit.component.css'],
})
export class UserQuestionEditComponent implements OnInit {
  questionForm: FormGroup;
  question: QuestionResponse | null = null;

  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthorizationService
  ) {
    this.questionForm = this.fb.group({
      title: [
        '', 
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      category: [
        '', 
        [Validators.required, Validators.maxLength(30)]
      ],
      topic: [
        '', 
        [Validators.required, Validators.maxLength(30)]
      ],
      content: [
        '', 
        [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]
      ],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.questionService.getQuestionById(id).subscribe({
        next: (data: QuestionResponse) => {
          this.question = data;
          this.populateForm(data);
        },
        error: (err) => {
          console.error('Erro ao carregar os detalhes da questão', err);
        },
      });

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
  }

  populateForm(question: QuestionResponse) {
    console.log(question);
    this.questionForm.patchValue({
      title: question.title,
      category: question.category,
      topic: question.topic,
      content: question.content,
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const formQuestion = this.questionForm.value;

      const userId = this.authService.getUserInfo()?.id;
      
      if (!userId) {
        this.authService.logout();
      }
      
      const updatedQuestion = {
        ...formQuestion,
        user_id: userId,
      };

      if (this.question) {
        this.questionService
          .updateQuestion(this.question.id, updatedQuestion)
          .subscribe({
            next: () => {
              this.snackBar.open('Pergunta atualizada com sucesso!', 'Fechar', {
                duration: 3000,
                panelClass: ['custom-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
              this.router.navigate(['/user/questions']);
            },
            error: (err) => {
              console.error('Erro ao atualizar a questão', err);
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
              this.router.navigate(['/user/questions']);
            },
          });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/user/questions']);
  }

  insertCodeSnippet() {
    const currentDescription = this.questionForm.get('content')?.value || '';
    const codeSnippet = '```\n// Seu código aqui\n```';
    this.questionForm.get('content')?.setValue(currentDescription + '\n' + codeSnippet);
  }
}
