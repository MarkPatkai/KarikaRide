import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'karikaride_token';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/admin/login`, payload)
      .pipe(tap(res => this.setToken(res.token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.token ?? ''}` });
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
