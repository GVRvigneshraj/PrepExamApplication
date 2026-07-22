import { Injectable, signal } from '@angular/core';

export interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  subjects: string[];
}

@Injectable({ providedIn: 'root' })
export class FacultyState {
  private _profile = signal<FacultyProfile | null>(null);
  private _selectedSubject = signal<string>('');

  readonly profile = this._profile.asReadonly();
  readonly selectedSubject = this._selectedSubject.asReadonly();

  setProfile(profile: FacultyProfile): void {
    this._profile.set(profile);
  }

  setSelectedSubject(subject: string): void {
    this._selectedSubject.set(subject);
  }

  clear(): void {
    this._profile.set(null);
    this._selectedSubject.set('');
  }
}
