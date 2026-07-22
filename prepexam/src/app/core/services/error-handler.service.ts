import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(
    private logger: LoggerService,
    private router: Router
  ) {}

  handle(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.logger.error('Unexpected error:', error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.logger.warn('Unauthorized — redirecting to login');
        localStorage.clear();
        this.router.navigate(['/login']);
        break;
      case 403:
        this.router.navigate(['/unauthorized']);
        break;
      case 404:
        this.logger.warn('Resource not found:', error.url);
        break;
      case 500:
        this.logger.error('Server error:', error.message);
        break;
      default:
        this.logger.error(`HTTP ${error.status}:`, error.message);
    }
  }
}
