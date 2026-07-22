import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-container" [class]="fullscreen() ? 'fullscreen' : ''">
      <div class="spinner"></div>
      @if (message()) {
        <p class="spinner-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
    .fullscreen { position: fixed; inset: 0; background: rgba(255,255,255,0.9); z-index: 999; }
    .spinner { width: 2rem; height: 2rem; border: 3px solid #E2E8F0; border-top-color: #6366F1; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spinner-message { margin-top: 0.75rem; color: #64748B; font-size: 0.875rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class LoadingSpinnerComponent {
  message = input('');
  fullscreen = input(false);
}
