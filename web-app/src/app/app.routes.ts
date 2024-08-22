import { Routes } from '@angular/router';
import { QuestionFormComponent } from './features/questions/question-form/question-form.component';
import { QuestionListComponent } from './features/questions/question-list/question-list.component';

export const routes: Routes = [
  {
    path: 'form',
    component: QuestionFormComponent,
  },
  {
    path: 'list',
    component: QuestionListComponent,
  },
  {
    path: '',
    redirectTo: '/form',
    pathMatch: 'full',
  },
];
