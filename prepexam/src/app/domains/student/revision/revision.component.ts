import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-student-revision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revision.component.html',
  styleUrl: './revision.component.scss',
})
export class StudentRevisionComponent {
  activeTab = signal<'upcoming' | 'completed'>('upcoming');

  upcomingRevisions = signal([
    { id: '1', subject: 'Physics', chapter: 'Mechanics', topic: 'Newton\'s Laws', nextReview: 'Today', mastery: 45, totalRevisions: 2, interval: '2 days' },
    { id: '2', subject: 'Chemistry', chapter: 'Organic', topic: 'Named Reactions', nextReview: 'Today', mastery: 60, totalRevisions: 3, interval: '3 days' },
    { id: '3', subject: 'Biology', chapter: 'Genetics', topic: 'Mendelian Genetics', nextReview: 'Tomorrow', mastery: 72, totalRevisions: 4, interval: '5 days' },
    { id: '4', subject: 'Physics', chapter: 'Thermodynamics', topic: 'Laws of Thermodynamics', nextReview: 'In 2 days', mastery: 38, totalRevisions: 1, interval: '1 day' },
    { id: '5', subject: 'Chemistry', chapter: 'Equilibrium', topic: 'Le Chatelier\'s Principle', nextReview: 'In 3 days', mastery: 55, totalRevisions: 2, interval: '3 days' },
  ]);

  completedRevisions = signal([
    { id: '6', subject: 'Physics', chapter: 'Optics', topic: 'Mirror Formula', lastReviewed: '2025-07-15', mastery: 85, totalRevisions: 6 },
    { id: '7', subject: 'Biology', chapter: 'Cell Biology', topic: 'Cell Division', lastReviewed: '2025-07-14', mastery: 90, totalRevisions: 5 },
  ]);

  setTab(tab: 'upcoming' | 'completed'): void {
    this.activeTab.set(tab);
  }

  getMasteryColor(mastery: number): string {
    if (mastery >= 80) return '#22c55e';
    if (mastery >= 60) return '#f59e0b';
    return '#ef4444';
  }

  getSubjectIcon(subject: string): string {
    switch (subject) {
      case 'Physics': return 'fas fa-atom';
      case 'Chemistry': return 'fas fa-flask';
      case 'Biology': return 'fas fa-seedling';
      default: return 'fas fa-book';
    }
  }

  getSubjectColor(subject: string): string {
    switch (subject) {
      case 'Physics': return '#4f46e5';
      case 'Chemistry': return '#0891b2';
      case 'Biology': return '#16a34a';
      default: return '#64748b';
    }
  }
}
