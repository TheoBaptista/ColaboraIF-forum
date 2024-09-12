import { Routes } from '@angular/router';
import { QuestionFormComponent } from './features/questions/question-form/question-form.component';
import { QuestionListComponent } from './features/questions/question-list/question-list.component';
import { QuestionDetailComponent } from './features/questions/question-detail/question-detail.component';
import { UserAdvancedSearchComponent } from './features/user/user-advanced-search/user-advanced-search.component';
import { UserNotificationsComponent } from './features/user/user-notifications/user-notifications.component';
import { UserQuestionsFavoritesComponent } from './features/user/user-questions-favorites/user-questions-favorites.component';
import { UserQuestionsComponent } from './features/user/user-questions/user-questions.component';
import { UserQuestionEditComponent } from './features/user/user-question-edit/user-question-edit.component';

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
  {
    path: 'question/:id',
    component: QuestionDetailComponent,
  },
  {
    path: 'user/questions',
    component: UserQuestionsComponent,
  },
  {
    path: 'user/edit-question/:id',
    component: UserQuestionEditComponent,
  },
  {
    path: 'user/questions-favorites',
    component: UserQuestionsFavoritesComponent,
  },
  {
    path: 'user/advanced-search',
    component: UserAdvancedSearchComponent,
  },
  {
    path: 'user/notifications',
    component: UserNotificationsComponent,
  },
];
