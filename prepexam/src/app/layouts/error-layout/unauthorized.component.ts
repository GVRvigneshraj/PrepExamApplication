import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="unauthorized">
      <i class="fas fa-lock"></i>
      <h1>403</h1>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>
  `,
  styles: [`
    .unauthorized { text-align: center; padding: 4rem 2rem; }
    .unauthorized i { font-size: 4rem; color: #CBD5E1; margin-bottom: 1rem; }
    .unauthorized h1 { font-size: 4rem; font-weight: 700; color: #1E293B; margin: 0; }
    .unauthorized h2 { font-size: 1.5rem; color: #1E293B; margin: 0.5rem 0; }
    .unauthorized p { color: #64748B; }
  `],
})
export class UnauthorizedComponent {}
