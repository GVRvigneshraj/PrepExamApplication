import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="landing-layout">
      <nav class="landing-nav">
        <div class="nav-brand">
          <span class="brand-name">PrepExam</span>
          <span class="brand-ai">AI</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login">Login</a>
          <a routerLink="/register" class="btn-register">Register</a>
        </div>
      </nav>
      <main class="landing-main">
        <router-outlet />
      </main>
      <footer class="landing-footer">
        <span>&copy; {{ currentYear }} PrepExam AI. All rights reserved.</span>
      </footer>
    </div>
  `,
  styles: [`
    .landing-layout { min-height: 100vh; display: flex; flex-direction: column; }
    .landing-nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .nav-brand { display: flex; align-items: baseline; gap: 0.25rem; }
    .brand-name { font-size: 1.5rem; font-weight: 700; color: #1E293B; }
    .brand-ai { font-size: 0.875rem; font-weight: 600; color: #6366F1; }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links a { text-decoration: none; color: #64748B; font-weight: 500; }
    .btn-register { background: #6366F1; color: white !important; padding: 0.5rem 1.25rem; border-radius: 0.5rem; }
    .landing-main { flex: 1; }
    .landing-footer { padding: 1.5rem; text-align: center; color: #94A3B8; font-size: 0.75rem; }
  `],
})
export class LandingLayout {
  currentYear = new Date().getFullYear();
}
