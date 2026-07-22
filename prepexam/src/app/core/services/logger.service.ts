import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly isDev = !environment.production;

  info(message: string, ...args: unknown[]): void {
    if (this.isDev) console.log(`[PrepExam] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.isDev) console.warn(`[PrepExam] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[PrepExam] ${message}`, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.isDev) console.debug(`[PrepExam] ${message}`, ...args);
  }
}
