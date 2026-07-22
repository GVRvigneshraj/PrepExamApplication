import { Injectable, signal } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../utils/constants';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class SettingsState {
  private _theme = signal<ThemeMode>(this.loadTheme());
  private _language = signal<string>(this.loadLanguage());

  readonly theme = this._theme.asReadonly();
  readonly language = this._language.asReadonly();

  constructor(private storage: StorageService) {}

  setTheme(theme: ThemeMode): void {
    this._theme.set(theme);
    this.storage.set(STORAGE_KEYS.THEME, theme);
    this.applyTheme(theme);
  }

  setLanguage(lang: string): void {
    this._language.set(lang);
    this.storage.set(STORAGE_KEYS.LANGUAGE, lang);
  }

  private loadTheme(): ThemeMode {
    return (this.storage.get<ThemeMode>(STORAGE_KEYS.THEME) ?? 'light') as ThemeMode;
  }

  private loadLanguage(): string {
    return this.storage.get<string>(STORAGE_KEYS.LANGUAGE) ?? 'en';
  }

  private applyTheme(theme: ThemeMode): void {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }
}
