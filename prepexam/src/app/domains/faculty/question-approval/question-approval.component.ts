import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-faculty-question-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-approval.component.html',
  styleUrl: './question-approval.component.scss',
})
export class FacultyQuestionApprovalComponent {
  activeTab = signal<'pending' | 'approved' | 'rejected'>('pending');

  pendingQuestions = signal([
    { id: '1', questionText: 'Calculate the work done in an isothermal process...', subject: 'Physics', chapter: 'Thermodynamics', submittedBy: 'Dr. Rajesh Kumar', submittedAt: '2025-07-15', difficulty: 'hard' },
    { id: '2', questionText: 'Explain the mechanism of SN1 reaction...', subject: 'Chemistry', chapter: 'Organic Chemistry', submittedBy: 'Prof. Sunita Sharma', submittedAt: '2025-07-14', difficulty: 'medium' },
    { id: '3', questionText: 'Describe the process of DNA replication...', subject: 'Biology', chapter: 'Genetics', submittedBy: 'Dr. Amit Patel', submittedAt: '2025-07-13', difficulty: 'medium' },
  ]);

  approvedQuestions = signal([
    { id: '4', questionText: 'A projectile is launched at 45 degrees...', subject: 'Physics', chapter: 'Mechanics', approvedBy: 'You', approvedAt: '2025-07-12', difficulty: 'easy' },
  ]);

  rejectedQuestions = signal([
    { id: '5', questionText: 'What is the pH of...', subject: 'Chemistry', chapter: 'Acids & Bases', rejectedBy: 'You', rejectedAt: '2025-07-11', reason: 'Duplicate question' },
  ]);

  setTab(tab: 'pending' | 'approved' | 'rejected'): void {
    this.activeTab.set(tab);
  }

  approveQuestion(id: string): void {
    const q = this.pendingQuestions().find(q => q.id === id);
    if (q) {
      this.approvedQuestions.update(list => [{ ...q, approvedBy: 'You', approvedAt: new Date().toISOString().split('T')[0] }, ...list]);
      this.pendingQuestions.update(list => list.filter(q => q.id !== id));
    }
  }

  rejectQuestion(id: string): void {
    const q = this.pendingQuestions().find(q => q.id === id);
    if (q) {
      this.rejectedQuestions.update(list => [{ ...q, rejectedBy: 'You', rejectedAt: new Date().toISOString().split('T')[0], reason: 'Needs revision' }, ...list]);
      this.pendingQuestions.update(list => list.filter(q => q.id !== id));
    }
  }

  getDifficultyColor(d: string): string {
    switch (d) { case 'easy': return '#22c55e'; case 'medium': return '#f59e0b'; case 'hard': return '#ef4444'; default: return '#64748b'; }
  }

  getSubjectColor(s: string): string {
    switch (s) { case 'Physics': return '#4f46e5'; case 'Chemistry': return '#0891b2'; case 'Biology': return '#16a34a'; default: return '#64748b'; }
  }
}
