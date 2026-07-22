import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-student-weak-areas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weak-areas.component.html',
  styleUrl: './weak-areas.component.scss',
})
export class StudentWeakAreasComponent {
  weakAreas = signal([
    { id: '1', subject: 'Physics', chapter: 'Thermodynamics', topic: 'Carnot Engine', accuracy: 25, totalAttempted: 12, recommendedAction: 'Practice 10 more questions' },
    { id: '2', subject: 'Physics', chapter: 'Optics', topic: 'Lens Formula', accuracy: 35, totalAttempted: 8, recommendedAction: 'Watch video lesson' },
    { id: '3', subject: 'Chemistry', chapter: 'Equilibrium', topic: 'Ionic Equilibrium', accuracy: 30, totalAttempted: 10, recommendedAction: 'Revise formulas' },
    { id: '4', subject: 'Biology', chapter: 'Genetics', topic: 'Probability in Genetics', accuracy: 40, totalAttempted: 15, recommendedAction: 'Solve past year questions' },
    { id: '5', subject: 'Chemistry', chapter: 'Organic', topic: 'Reaction Mechanisms', accuracy: 42, totalAttempted: 20, recommendedAction: 'Practice named reactions' },
  ]);

  getAccuracyColor(accuracy: number): string {
    if (accuracy >= 50) return '#f59e0b';
    return '#ef4444';
  }

  getSubjectColor(subject: string): string {
    switch (subject) {
      case 'Physics': return '#4f46e5';
      case 'Chemistry': return '#0891b2';
      case 'Biology': return '#16a34a';
      default: return '#64748b';
    }
  }

  getPriority(accuracy: number): string {
    if (accuracy < 30) return 'critical';
    if (accuracy < 45) return 'high';
    return 'medium';
  }
}
