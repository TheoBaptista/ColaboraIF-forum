import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css',
})
export class QuestionListComponent {
  constructor(private router: Router) {}

  goToQuestionForm() {
    this.router.navigate(['/form']);
  }
}
