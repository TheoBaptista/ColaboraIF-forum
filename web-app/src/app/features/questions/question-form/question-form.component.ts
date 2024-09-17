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
  ],
})
export class QuestionFormComponent {
  questionForm: FormGroup;

  categories = ['Frontend', 'Backend', 'DevOps', 'Data Science'];

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      topic: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const formData: Question = {
        title: this.questionForm.value.title,
        content: this.questionForm.value.description,
        topic: this.questionForm.value.topic,
        category: this.questionForm.value.category,
        user_id: 'user123',
        username: 'João',
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
