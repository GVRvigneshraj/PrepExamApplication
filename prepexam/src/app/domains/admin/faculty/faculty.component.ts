import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-admin-faculty',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Faculty Management</h1>
      <app-button size="sm">+ Add Faculty</app-button>
    </div>

    <app-card variant="elevated">
      <div class="faculty-list">
        @for (f of facultyList(); track f.id) {
          <div class="faculty-row">
            <div class="faculty-info">
              <span class="faculty-name">{{ f.name }}</span>
              <span class="faculty-subject">{{ f.subject }}</span>
            </div>
            <app-button variant="secondary" size="sm">Manage</app-button>
          </div>
        }
      </div>
    </app-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .faculty-list { display: flex; flex-direction: column; }
    .faculty-row { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #F1F5F9; }
    .faculty-info { flex: 1; display: flex; flex-direction: column; }
    .faculty-name { font-weight: 500; }
    .faculty-subject { font-size: 0.875rem; color: #64748B; }
  `],
})
export class AdminFacultyComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Faculty Management' }];

  facultyList = signal([
    { id: '1', name: 'Dr. Priya Sharma', subject: 'Physics' },
    { id: '2', name: 'Prof. Rajesh', subject: 'Chemistry' },
    { id: '3', name: 'Dr. Lakshmi', subject: 'Biology' },
  ]);
}
