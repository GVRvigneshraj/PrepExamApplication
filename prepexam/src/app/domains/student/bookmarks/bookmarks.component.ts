import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-student-bookmarks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss',
})
export class StudentBookmarksComponent {
  activeFilter = signal<string>('all');

  bookmarks = signal([
    { id: '1', subject: 'Physics', chapter: 'Mechanics', question: 'A body of mass 5 kg is thrown vertically upward with velocity 20 m/s. Find the maximum height reached.', bookmarkedAt: '2025-07-15', difficulty: 'medium' },
    { id: '2', subject: 'Chemistry', chapter: 'Chemical Bonding', question: 'Explain the hybridization of carbon in methane molecule.', bookmarkedAt: '2025-07-14', difficulty: 'easy' },
    { id: '3', subject: 'Biology', chapter: 'Genetics', question: 'What is the significance of crossing over in meiosis?', bookmarkedAt: '2025-07-13', difficulty: 'hard' },
    { id: '4', subject: 'Physics', chapter: 'Thermodynamics', question: 'Calculate the work done in an isothermal process for 2 moles of ideal gas.', bookmarkedAt: '2025-07-12', difficulty: 'hard' },
    { id: '5', subject: 'Chemistry', chapter: 'Equilibrium', question: 'Derive the expression for the equilibrium constant Kp in terms of Kc.', bookmarkedAt: '2025-07-11', difficulty: 'medium' },
  ]);

  filters = ['all', 'Physics', 'Chemistry', 'Biology'];

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  get filteredBookmarks() {
    const filter = this.activeFilter();
    if (filter === 'all') return this.bookmarks();
    return this.bookmarks().filter(b => b.subject === filter);
  }

  removeBookmark(id: string): void {
    this.bookmarks.update(list => list.filter(b => b.id !== id));
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#64748b';
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
