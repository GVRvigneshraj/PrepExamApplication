import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { StorageService } from '../services/storage.service';

export interface DecodedToken {
  sub: string;
  role: string;
  userId: number;
  exp: number;
  iat: number;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly REFRESH_BUFFER_MS = 5 * 60 * 1000;

  constructor(private storage: StorageService) {}

  getRole(): string | null {
    const decoded = this.decode();
    if (!decoded?.role) return null;
    return this.mapBackendRole(decoded.role);
  }

  getRawRole(): string | null {
    return this.decode()?.role ?? null;
  }

  getUserId(): number | null {
    return this.decode()?.userId ?? null;
  }

  getEmail(): string | null {
    return this.decode()?.sub ?? null;
  }

  isExpired(): boolean {
    const decoded = this.decode();
    if (!decoded) return true;
    return decoded.exp * 1000 < Date.now();
  }

  isExpiringSoon(): boolean {
    const decoded = this.decode();
    if (!decoded) return true;
    return decoded.exp * 1000 < Date.now() + this.REFRESH_BUFFER_MS;
  }

  getTokenPayload(): DecodedToken | null {
    return this.decode();
  }

  /** Maps backend role strings (STUDENT, FACULTY, ADMIN) to app constants (ROLE_STUDENT, etc.) */
  private mapBackendRole(role: string): string {
    const normalized = role.toUpperCase().replace(/^ROLE_/, '');
    switch (normalized) {
      case 'STUDENT': return 'ROLE_STUDENT';
      case 'FACULTY': return 'ROLE_FACULTY';
      case 'ADMIN': return 'ROLE_ADMIN';
      default: return role;
    }
  }

  private decode(): DecodedToken | null {
    const token = this.storage.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }
}
