import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiGatewayUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly userSignal = signal<User | null>(this.getStoredUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const user: User = {
      id: response.userId,
      email: response.email,
      fullName: response.fullName,
      role: response.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this.tokenSignal.set(response.token);
    this.userSignal.set(user);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
