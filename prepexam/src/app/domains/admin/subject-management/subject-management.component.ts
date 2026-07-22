import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-subject-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subject-container">
      <div class="page-header">
        <div>
          <h1>Subject Management</h1>
          <p>Manage subjects and chapters for each exam</p>
        </div>
        <button class="btn-primary"><i class="fas fa-plus"></i> Add Subject</button>
      </div>

      <div class="exam-tabs">
        <button *ngFor="let exam of exams" type="button" class="exam-tab" [class.active]="activeExam() === exam" (click)="activeExam.set(exam)">
          {{ exam }}
        </button>
      </div>

      <div class="subjects-grid">
        <div class="subject-card" *ngFor="let subject of subjects()">
          <div class="subject-header">
            <h3>{{ subject.name }}</h3>
            <span class="chapter-count">{{ subject.chapters }} chapters</span>
          </div>
          <div class="subject-stats">
            <span><i class="fas fa-list"></i> {{ subject.questions }} questions</span>
          </div>
          <div class="subject-actions">
            <button class="icon-btn"><i class="fas fa-edit"></i></button>
            <button class="icon-btn danger"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subject-container { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #0f172a; }
    p { margin: 0.25rem 0 0 0; color: #64748b; }
    .btn-primary { padding: 0.65rem 1.25rem; background: #4f46e5; color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
    .exam-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .exam-tab { padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.15s; }
    .exam-tab.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
    .subjects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .subject-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.25rem; }
    .subject-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    h3 { margin: 0; font-size: 1.05rem; color: #1e293b; }
    .chapter-count { font-size: 0.78rem; color: #94a3b8; font-weight: 500; }
    .subject-stats { font-size: 0.85rem; color: #64748b; margin-bottom: 1rem; display: flex; gap: 1rem; }
    .subject-actions { display: flex; gap: 0.35rem; }
    .icon-btn { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; display: grid; place-items: center; font-size: 0.82rem; color: #64748b; background: #f1f5f9; transition: all 0.15s; }
    .icon-btn:hover { background: #e2e8f0; }
    .icon-btn.danger:hover { background: #fee2e2; color: #dc2626; }
  `]
})
export class AdminSubjectManagementComponent {
  exams = ['NEET', 'JEE', 'UPSC', 'SSC', 'TNPSC', 'Railway', 'Banking', 'Defence'];
  activeExam = signal('NEET');

  subjects = signal([
    { name: 'Physics', chapters: 12, questions: 450 },
    { name: 'Chemistry', chapters: 14, questions: 520 },
    { name: 'Biology', chapters: 16, questions: 680 },
  ]);
}
