import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { SettingsState, ThemeMode } from '../../../core/state/settings.state';

@Component({
  selector: 'app-faculty-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h1>Faculty Settings</h1>
      <p class="subtitle">Manage your account preferences</p>

      <div class="settings-section">
        <h3>Appearance</h3>
        <div class="theme-options">
          <button type="button" class="theme-btn" [class.active]="theme === 'light'" (click)="setTheme('light')">
            <i class="fas fa-sun"></i> Light
          </button>
          <button type="button" class="theme-btn" [class.active]="theme === 'dark'" (click)="setTheme('dark')">
            <i class="fas fa-moon"></i> Dark
          </button>
          <button type="button" class="theme-btn" [class.active]="theme === 'system'" (click)="setTheme('system')">
            <i class="fas fa-desktop"></i> System
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h3>Notifications</h3>
        <div class="toggle-row">
          <span>Email notifications for question approvals</span>
          <label class="toggle"><input type="checkbox" checked /><span class="slider"></span></label>
        </div>
        <div class="toggle-row">
          <span>Student submission alerts</span>
          <label class="toggle"><input type="checkbox" checked /><span class="slider"></span></label>
        </div>
      </div>

      <button class="btn-danger" (click)="logout()"><i class="fas fa-sign-out-alt"></i> Log Out</button>
    </div>
  `,
  styles: [`
    .settings-container { max-width: 700px; margin: 0 auto; }
    h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #0f172a; }
    .subtitle { margin: 0.25rem 0 2rem 0; color: #64748b; }
    .settings-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; margin-bottom: 1rem; }
    h3 { margin: 0 0 1rem 0; font-size: 1rem; color: #1e293b; }
    .theme-options { display: flex; gap: 0.75rem; }
    .theme-btn { flex: 1; padding: 0.85rem; border: 2px solid #e2e8f0; border-radius: 10px; background: #fff; cursor: pointer; font-weight: 600; color: #475569; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.15s;
      &:hover { border-color: #c7d2fe; }
      &.active { border-color: #4f46e5; color: #4f46e5; background: #eef2ff; }
    }
    .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;
      span { font-size: 0.9rem; color: #1e293b; }
    }
    .toggle { position: relative; display: inline-block; width: 44px; height: 24px;
      input { opacity: 0; width: 0; height: 0; }
      .slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; border-radius: 24px; transition: 0.22s;
        &::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.22s; }
      }
      input:checked + .slider { background: #4f46e5; }
      input:checked + .slider::before { transform: translateX(20px); }
    }
    .btn-danger { margin-top: 1rem; padding: 0.65rem 1.5rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
      &:hover { background: #fca5a5; }
    }
  `]
})
export class FacultySettingsComponent {
  private auth = inject(AuthService);
  private settingsState = inject(SettingsState);
  theme = this.settingsState.theme();

  setTheme(t: ThemeMode): void {
    this.settingsState.setTheme(t);
    this.theme = t;
  }

  logout(): void { this.auth.logout(); }
}
