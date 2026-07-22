import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-admin-exams',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Exam Management</h1>
      <app-button size="sm">+ Add Exam</app-button>
    </div>

    <div class="exam-grid">
      @for (exam of exams(); track exam.id) {
        <app-card variant="elevated">
          <div class="exam-item">
            <div class="exam-info">
              <h3>{{ exam.name }}</h3>
              <p>{{ exam.subjects }} subjects &middot; {{ exam.students }} students</p>
            </div>
            <app-badge [text]="exam.isActive ? 'Active' : 'Inactive'" [variant]="exam.isActive ? 'success' : 'danger'" />
          </div>
        </app-card>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .exam-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .exam-item { display: flex; align-items: center; justify-content: space-between; }
    .exam-info h3 { margin: 0; }
    .exam-info p { margin: 0.25rem 0 0; color: #64748B; font-size: 0.875rem; }
  `],
})
export class AdminExamsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Exam Management' }];

  exams = signal([
    { id: '1', name: 'NEET', subjects: 3, students: 5200, isActive: true },
    { id: '2', name: 'JEE', subjects: 3, students: 3100, isActive: true },
    { id: '3', name: 'UPSC', subjects: 3, students: 1800, isActive: true },
    { id: '4', name: 'TNPSC', subjects: 3, students: 1200, isActive: true },
    { id: '5', name: 'Railway', subjects: 4, students: 800, isActive: false },
  ]);
}
