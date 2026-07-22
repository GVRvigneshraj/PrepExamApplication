import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="error-layout">
      <router-outlet />
      <a routerLink="/login" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to Login
      </a>
    </div>
  `,
  styles: [`
    .error-layout { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
    .back-link { margin-top: 1.5rem; color: #6366F1; text-decoration: none; font-weight: 500; }
    .back-link:hover { text-decoration: underline; }
  `],
})
export class ErrorLayout {}
