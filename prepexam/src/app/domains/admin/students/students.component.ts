import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Student Management</h1>
      <app-button size="sm">+ Add Student</app-button>
    </div>

    <app-card variant="elevated">
      <div class="student-list">
        @for (s of students(); track s.id) {
          <div class="student-row">
            <div class="student-info">
              <span class="student-name">{{ s.name }}</span>
              <span class="student-email">{{ s.email }}</span>
            </div>
            <app-badge [text]="s.exam" variant="info" />
            <app-button variant="secondary" size="sm">Manage</app-button>
          </div>
        }
      </div>
    </app-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .student-list { display: flex; flex-direction: column; }
    .student-row { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #F1F5F9; }
    .student-info { flex: 1; display: flex; flex-direction: column; }
    .student-name { font-weight: 500; }
    .student-email { font-size: 0.875rem; color: #64748B; }
  `],
})
export class AdminStudentsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Student Management' }];

  students = signal([
    { id: '1', name: 'Ravi Kumar', email: 'ravi@example.com', exam: 'NEET' },
    { id: '2', name: 'Anita Devi', email: 'anita@example.com', exam: 'JEE' },
    { id: '3', name: 'Suresh P', email: 'suresh@example.com', exam: 'UPSC' },
  ]);
}
