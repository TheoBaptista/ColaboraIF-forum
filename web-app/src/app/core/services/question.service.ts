import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer, Question, QuestionResponse } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createQuestion(question: Question): Observable<any> {
    return this.http.post(`${this.baseUrl}/questions`, question);
  }

  listQuestions(): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(`${this.baseUrl}/questions`);
  }

  getQuestionById(id: string): Observable<QuestionResponse> {
    return this.http.get<QuestionResponse>(`${this.baseUrl}/questions/${id}`);
  }

  searchQuestions(query: string): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(
      `${this.baseUrl}/questions/search?q=${query}`
    );
  }

  advancedSearch(filters: any): Observable<QuestionResponse[]> {
    let params = new HttpParams();

    // Adiciona os parâmetros de pesquisa se existirem
    if (filters.titleOrDescription) {
      params = params.set('titleOrDescription', filters.titleOrDescription);
    }
    if (filters.topic) {
      params = params.set('topic', filters.topic);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.hasAnswers !== '') {
      params = params.set('hasAnswers', filters.hasAnswers);
    }
    if (filters.isSolved !== '') {
      params = params.set('isSolved', filters.isSolved);
    }

    return this.http.get<QuestionResponse[]>(`${this.baseUrl}/questions/advanced-search`, { params });
  }

  getUserQuestions(userId: string): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(`${this.baseUrl}/user-questions`, {
      params: { userId },
    });
  }

  deleteQuestion(id: string, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/questions/${id}/${userId}`);
  }

  updateQuestion(id: string, question: any) {
    return this.http.patch(`${this.baseUrl}/questions/${id}`, question);
  }

  getUserNotifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/${userId}`);
  }

  deleteNotification(userId: string, notificationId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/notifications/${userId}/${notificationId}`
    );
  }

  addAnswer(questionId: string, answer: Answer): Observable<Answer> {
    
  const answerRequest = {
    content: answer.content,
    userId: answer.user_id,
    username: answer.username,
  };

  return this.http.post<Answer>(
      `${this.baseUrl}/questions/${questionId}/answers`,
      answerRequest
    );
  }
  
  markAnswerAsCorrect(questionId: string, answerId: string, userId: string) {
    return this.http.patch(`${this.baseUrl}/questions/${questionId}/answers/${answerId}/correct`, { userId });
  }

  addFavorite(userId: string, questionId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/favorite-questions`, { userId, questionId });
  }

  removeFavorite(userId: string, questionId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/favorite-questions`, { params: { userId, questionId } });
  }

  getFavoriteQuestionsInfo(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/favorite-questions`, { params: { userId } });
  }

  getFavoriteQuestionsOfUser(userId: string) {
    return this.http.get<QuestionResponse[]>(`${this.baseUrl}/user/favorite-questions?userId=${userId}`);
  }

  getCategories(): Observable<any> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  getTopics(name: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/topics/${name}`);
  }

}
