import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private baseUrl = environment.apiUrl;
  private tokenKey = 'authToken';
  private userKey = 'authUser';


  constructor(private http: HttpClient, private router: Router) {}

  saveToken(token: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }

  saveUserInfo(user: { id: string, email: string, name: string }) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  getUserInfo(): { id: string, email: string, name: string } | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      this.router.navigate(['/login']);
    }
  }

  login(idToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { idToken });
  }
}
