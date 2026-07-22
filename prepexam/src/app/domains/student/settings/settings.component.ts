import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { SettingsState, ThemeMode } from '../../../core/state/settings.state';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/utils/constants';

@Component({
  selector: 'app-student-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class StudentSettingsComponent {
  private auth = inject(AuthService);
  private settingsState = inject(SettingsState);
  private storage = inject(StorageService);

  activeSection = signal<string>('account');

  profile = signal({
    fullName: 'Student',
    email: this.auth.getEmail() || '',
    phone: '',
  });

  learningSettings = signal({
    preferredLanguage: 'en',
    dailyGoal: 50,
    targetScore: 600,
    studyHours: 4,
    defaultExam: 'neet',
  });

  appearanceSettings = signal({
    theme: this.settingsState.theme() as ThemeMode,
    fontSize: 'medium',
  });

  notificationSettings = signal({
    pushNotifications: true,
    emailNotifications: false,
    reminderNotifications: true,
    dailyPracticeReminder: true,
  });

  sections = [
    { key: 'account', label: 'Account', icon: 'fas fa-user' },
    { key: 'learning', label: 'Learning', icon: 'fas fa-book-open' },
    { key: 'appearance', label: 'Appearance', icon: 'fas fa-palette' },
    { key: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { key: 'privacy', label: 'Privacy', icon: 'fas fa-shield-alt' },
    { key: 'about', label: 'About', icon: 'fas fa-info-circle' },
  ];

  setSection(section: string): void {
    this.activeSection.set(section);
  }

  setTheme(theme: ThemeMode): void {
    this.settingsState.setTheme(theme);
    this.appearanceSettings.update(s => ({ ...s, theme }));
  }

  saveProfile(): void {
    this.storage.set(STORAGE_KEYS.USER_PROFILE, this.profile());
  }

  saveLearning(): void {
    this.storage.set(STORAGE_KEYS.LEARNING_SETTINGS, this.learningSettings());
  }

  saveNotifications(): void {
    this.storage.set(STORAGE_KEYS.NOTIFICATION_PREFS, this.notificationSettings());
  }

  updateNotification(key: string, value: boolean): void {
    this.notificationSettings.update(s => ({ ...s, [key]: value }));
  }

  logout(): void {
    this.auth.logout();
  }
}
