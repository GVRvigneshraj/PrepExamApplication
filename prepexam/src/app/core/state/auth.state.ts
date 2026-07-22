import { Injectable, signal, computed } from '@angular/core';
import { TokenService } from '../auth/token.service';
import { StorageService } from '../services/storage.service';

export interface AuthUser {
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthState {
  private _user = signal<AuthUser | null>(null);
  private _isLoading = signal(false);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly role = computed(() => this._user()?.role ?? null);
  readonly isAdmin = computed(() => this._user()?.role === 'ROLE_ADMIN');
  readonly isFaculty = computed(() => this._user()?.role === 'ROLE_FACULTY');
  readonly isStudent = computed(() => this._user()?.role === 'ROLE_STUDENT');

  constructor(
    private tokenService: TokenService,
    private storage: StorageService
  ) {
    this.loadFromStorage();
  }

  setUser(user: AuthUser): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  private loadFromStorage(): void {
    if (!this.tokenService.isExpired()) {
      const email = this.tokenService.getEmail();
      const role = this.tokenService.getRole();
      if (email && role) {
        this._user.set({ email, role });
      }
    }
  }
}
