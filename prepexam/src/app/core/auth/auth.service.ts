import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthEndpoints } from '../api/endpoints/auth.endpoint';
import { TokenService } from './token.service';
import { StorageService } from '../services/storage.service';
import { AuthState } from '../state/auth.state';
import { LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest } from '../api/dto/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private storage = inject(StorageService);
  private router = inject(Router);
  private authState = inject(AuthState);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(AuthEndpoints.LOGIN, credentials).pipe(
      tap((res) => {
        if (res.success && res.data?.token) {
          this.storage.setToken(res.data.token);
          if (res.data.refreshToken) {
            this.storage.setRefreshToken(res.data.refreshToken);
          }
          const role = this.tokenService.getRole();
          const email = this.tokenService.getEmail();
          if (role && email) {
            this.authState.setUser({ email, role });
          }
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(AuthEndpoints.REGISTER, data);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.storage.getRefreshToken();
    return this.http.post<RefreshTokenResponse>(AuthEndpoints.REFRESH_TOKEN, { refreshToken }).pipe(
      tap((res) => {
        if (res.success && res.data?.token) {
          this.storage.setToken(res.data.token);
          if (res.data.refreshToken) {
            this.storage.setRefreshToken(res.data.refreshToken);
          }
        }
      })
    );
  }

  logout(): void {
    this.authState.clearUser();
    this.storage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !this.tokenService.isExpired();
  }

  hasRefreshToken(): boolean {
    return !!this.storage.getRefreshToken();
  }

  getRole(): string | null {
    return this.tokenService.getRole();
  }

  getEmail(): string | null {
    return this.tokenService.getEmail();
  }

  /** Returns the routing path for the current user's role */
  getRoleRoute(): string {
    const role = this.getRole();
    switch (role) {
      case 'ROLE_ADMIN': return '/admin';
      case 'ROLE_FACULTY': return '/faculty';
      case 'ROLE_STUDENT': return this.getStudentBasePath();
      default: return '/login';
    }
  }

  /** Gets student base path with selected exam */
  private getStudentBasePath(): string {
    const exam = this.storage.get<string>('selectedExam') || 'neet';
    return `/${exam}`;
  }

  /** Navigates to the appropriate dashboard after login */
  navigateAfterLogin(): void {
    const role = this.getRole();
    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ROLE_FACULTY':
        this.router.navigate(['/faculty/dashboard']);
        break;
      case 'ROLE_STUDENT':
        this.router.navigate([this.getStudentBasePath(), 'dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
