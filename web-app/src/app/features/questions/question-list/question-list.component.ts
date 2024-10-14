import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { Answer, Question, QuestionResponse } from '../../../core/models/question.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { LineClampDirective } from '../../../shared/directives/line-clamp.directive';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, LineClampDirective],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css',
})
export class QuestionListComponent {
  questions: QuestionResponse[] = [];
  questionsResponseCount = 0;
  searchTerm: string = ''; 
  searchSubject: Subject<string> = new Subject(); 

  constructor(
    private router: Router,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.loadQuestions();

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(searchTerm => {
      this.searchQuestions(searchTerm);
    });

  }

  loadQuestions() {
    this.questionService.listQuestions().subscribe({
      next: (data: QuestionResponse[]) => {
        this.questions = this.initializeAnswers(data);
      },


      error: (err) => {
        console.error('Erro ao carregar a lista de questões', err);
      },
    });
  }

  goToQuestionForm() {
    this.router.navigate(['/form']);
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

  onSearchInputChange() {
    this.searchSubject.next(this.searchTerm);
  }

  hasCorrectAnswer(question: any): boolean {
    return question.answers.length > 0 && question.answers.some((answer: any) => answer.is_correct_answer);
  }

  searchQuestions(searchTerm: string) {
    if (this.searchTerm.length < 3) {
      return;
    }

    this.questionService.searchQuestions(this.searchTerm).subscribe({
      next: (data: QuestionResponse[]) => {
        this.questions = this.initializeAnswers(data);
      },
      error: (err) => {
        console.error('Erro ao buscar as questões', err);
      },
    });
  }
}
