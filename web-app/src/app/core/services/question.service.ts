import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, QuestionResponse } from '../models/question.model';

@Injectable({
  providedIn: 'root'
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
}
