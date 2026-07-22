import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-student-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss',
})
export class StudentAchievementsComponent {
  activeTab = signal<'earned' | 'locked'>('earned');

  earnedAchievements = signal([
    { id: '1', title: 'First Steps', description: 'Complete your first practice session', icon: 'fas fa-shoe-prints', category: 'milestone', earnedAt: '2025-06-01', xp: 50 },
    { id: '2', title: '7-Day Streak', description: 'Practice for 7 consecutive days', icon: 'fas fa-fire', category: 'streak', earnedAt: '2025-06-15', xp: 200 },
    { id: '3', title: 'Century Club', description: 'Answer 100 questions correctly', icon: 'fas fa-hundred-points', category: 'score', earnedAt: '2025-06-20', xp: 150 },
    { id: '4', title: 'Speed Demon', description: 'Complete a test in under 50% time', icon: 'fas fa-bolt', category: 'practice', earnedAt: '2025-07-01', xp: 100 },
    { id: '5', title: 'Perfect Score', description: 'Score 100% in any assessment', icon: 'fas fa-star', category: 'score', earnedAt: '2025-07-10', xp: 300 },
    { id: '6', title: 'Mock Master', description: 'Complete 10 mock tests', icon: 'fas fa-trophy', category: 'practice', earnedAt: '2025-07-14', xp: 250 },
  ]);

  lockedAchievements = signal([
    { id: '7', title: '30-Day Streak', description: 'Practice for 30 consecutive days', icon: 'fas fa-fire', category: 'streak', xp: 500, progress: 12, target: 30 },
    { id: '8', title: 'Thousand Club', description: 'Answer 1000 questions correctly', icon: 'fas fa-hundred-points', category: 'score', xp: 400, progress: 342, target: 1000 },
    { id: '9', title: 'Speed King', description: 'Complete a test in under 30% time', icon: 'fas fa-bolt', category: 'practice', xp: 200, progress: 0, target: 1 },
    { id: '10', title: 'All Rounder', description: 'Score 80%+ in all subjects', icon: 'fas fa-medal', category: 'score', xp: 350, progress: 1, target: 3 },
  ]);

  setTab(tab: 'earned' | 'locked'): void {
    this.activeTab.set(tab);
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'streak': return 'fas fa-fire';
      case 'score': return 'fas fa-star';
      case 'practice': return 'fas fa-dumbbell';
      case 'milestone': return 'fas fa-flag-checkered';
      default: return 'fas fa-award';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'streak': return '#ef4444';
      case 'score': return '#f59e0b';
      case 'practice': return '#4f46e5';
      case 'milestone': return '#22c55e';
      default: return '#64748b';
    }
  }
}
