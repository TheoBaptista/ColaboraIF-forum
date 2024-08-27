import { Routes } from '@angular/router';
import { QuestionFormComponent } from './features/questions/question-form/question-form.component';
import { QuestionListComponent } from './features/questions/question-list/question-list.component';
import { QuestionDetailComponent } from './features/questions/question-detail/question-detail.component';

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
    redirectTo: '/list',
    pathMatch: 'full',
  },
  { path: 'question/:id', 
    component: QuestionDetailComponent 
  },
];
