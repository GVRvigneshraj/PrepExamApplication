import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (isVisible()) {
      <div [class]="'toast toast-' + variant()">
        <i [class]="'fas ' + iconClass"></i>
        <span>{{ message() }}</span>
        <button class="toast-close" (click)="close.emit()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    }
  `,
  styles: [`
    .toast { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem; animation: slideIn 0.3s ease; }
    .toast-success { background: #F0FDF4; color: #16A34A; border: 1px solid #BBF7D0; }
    .toast-error { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    .toast-warning { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }
    .toast-info { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
    .toast-close { background: none; border: none; cursor: pointer; color: inherit; margin-left: auto; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `],
})
export class ToastComponent {
  message = input('');
  variant = input<'success' | 'error' | 'warning' | 'info'>('info');
  isVisible = input(false);
  close = output();

  get iconClass(): string {
    const icons: Record<string, string> = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };
    return icons[this.variant()] || icons['info'];
  }
}
