import { Injectable, signal } from '@angular/core';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
  id: number;
  title: string;
  message: string;
  variant: AlertVariant;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class AppAlertService {
  private readonly _alerts = signal<AlertMessage[]>([]);
  readonly alerts = this._alerts.asReadonly();

  show(config: Omit<AlertMessage, 'id'>): void {
    const alert: AlertMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      duration: 3000,
      ...config,
    };

    this._alerts.update((items) => [...items, alert]);

    const timeout = window.setTimeout(() => this.dismiss(alert.id), alert.duration ?? 3000);
    if (typeof timeout === 'number') {
      // keep the timer reference so it can be cleaned up if needed in future iterations
    }
  }

  success(message: string, title = 'Success'): void {
    this.show({ title, message, variant: 'success' });
  }

  error(message: string, title = 'Error'): void {
    this.show({ title, message, variant: 'error' });
  }

  warning(message: string, title = 'Warning'): void {
    this.show({ title, message, variant: 'warning' });
  }

  info(message: string, title = 'Information'): void {
    this.show({ title, message, variant: 'info' });
  }

  dismiss(id: number): void {
    this._alerts.update((items) => items.filter((item) => item.id !== id));
  }
}
