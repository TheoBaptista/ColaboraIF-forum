import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { QuestionResponse } from '../../../core/models/question.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.css'
})
export class QuestionDetailComponent {
  question: QuestionResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
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
        }
      });
    }
  }

}
