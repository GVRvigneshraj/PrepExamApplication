import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppAlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-host" aria-live="polite" aria-atomic="true">
      @for (item of alerts(); track item.id) {
        <div class="alert-message alert-{{ item.variant }} fade-in">
          <div class="alert-icon">
            <i class="fas" [class.fa-check-circle]="item.variant === 'success'"
               [class.fa-exclamation-circle]="item.variant === 'error'"
               [class.fa-exclamation-triangle]="item.variant === 'warning'"
               [class.fa-info-circle]="item.variant === 'info'"></i>
          </div>
          <div class="alert-content">
            <strong>{{ item.title }}</strong>
            <span>{{ item.message }}</span>
          </div>
          <button class="alert-close" type="button" (click)="dismiss(item.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .alert-host {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 360px;
      width: min(360px, calc(100vw - 2rem));
    }

    .alert-message {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.9rem 1rem;
      border-radius: 0.8rem;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
      border: 1px solid transparent;
      backdrop-filter: blur(8px);
      animation: alertSlideIn 0.24s ease-out;
    }

    .alert-success {
      background: #f0fdf4;
      color: #166534;
      border-color: #bbf7d0;
    }

    .alert-error {
      background: #fef2f2;
      color: #b91c1c;
      border-color: #fecaca;
    }

    .alert-warning {
      background: #fff7ed;
      color: #b45309;
      border-color: #fed7aa;
    }

    .alert-info {
      background: #eff6ff;
      color: #1d4ed8;
      border-color: #bfdbfe;
    }

    .alert-icon {
      flex: 0 0 auto;
      margin-top: 0.1rem;
      font-size: 1rem;
    }

    .alert-content {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      flex: 1;
      min-width: 0;
    }

    .alert-content strong {
      font-size: 0.95rem;
    }

    .alert-content span {
      font-size: 0.88rem;
      line-height: 1.4;
    }

    .alert-close {
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      padding: 0;
      font-size: 0.9rem;
      opacity: 0.75;
    }

    @keyframes alertSlideIn {
      from {
        transform: translateY(-8px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `],
})
export class AlertHostComponent {
  constructor(private readonly appAlertService: AppAlertService) {}

  get alerts() {
    return this.appAlertService.alerts;
  }

  dismiss(id: number): void {
    this.appAlertService.dismiss(id);
  }
}
