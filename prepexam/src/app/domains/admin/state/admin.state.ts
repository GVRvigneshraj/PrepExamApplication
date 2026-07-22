import { Injectable, signal } from '@angular/core';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class AdminState {
  private _profile = signal<AdminProfile | null>(null);
  private _settings = signal<Record<string, unknown>>({});

  readonly profile = this._profile.asReadonly();
  readonly settings = this._settings.asReadonly();

  setProfile(profile: AdminProfile): void {
    this._profile.set(profile);
  }

  updateSettings(key: string, value: unknown): void {
    this._settings.update((s) => ({ ...s, [key]: value }));
  }

  clear(): void {
    this._profile.set(null);
    this._settings.set({});
  }
}
