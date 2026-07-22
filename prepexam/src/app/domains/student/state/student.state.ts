import { Injectable, signal } from '@angular/core';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  enrolledExams: string[];
}

@Injectable({ providedIn: 'root' })
export class StudentState {
  private _profile = signal<StudentProfile | null>(null);
  private _selectedExam = signal<string>('neet');

  readonly profile = this._profile.asReadonly();
  readonly selectedExam = this._selectedExam.asReadonly();

  setProfile(profile: StudentProfile): void {
    this._profile.set(profile);
  }

  setSelectedExam(examId: string): void {
    this._selectedExam.set(examId);
  }

  clear(): void {
    this._profile.set(null);
    this._selectedExam.set('neet');
  }
}
