import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  getUserQuestions(userId: string): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(`${this.baseUrl}/user-questions`, {
      params: { userId },
    });
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/questions/${id}`);
  }

  updateQuestion(id: string, question: any) {
    return this.http.patch(`${this.baseUrl}/questions/${id}`, question);
  }

  getUserNotifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`, {
      params: { userId }
    });
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/notifications/${notificationId}`);
  }

  addAnswer(questionId: string, answer: any): Observable<Answer> {
    return this.http.post<Answer>(`${this.baseUrl}/questions/${questionId}/answers`, answer);
  }
}
