import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, BadgeComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Faculty Dashboard</h1>
      <p>Manage questions, mock tests, and track student progress</p>
    </div>

    <div class="stats-grid">
      <app-card title="Questions Created" variant="elevated">
        <div class="stat-value">342</div>
        <div class="stat-sub">Across 5 subjects</div>
      </app-card>

      <app-card title="Mock Tests Built" variant="elevated">
        <div class="stat-value">28</div>
        <div class="stat-sub">12 published</div>
      </app-card>

      <app-card title="Students Assigned" variant="elevated">
        <div class="stat-value">156</div>
        <div class="stat-sub">Active students</div>
      </app-card>

      <app-card title="Pending Approvals" variant="elevated">
        <div class="stat-value">15</div>
        <div class="stat-sub">Questions to review</div>
      </app-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0 0 0.25rem; }
    .page-header p { color: #64748B; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .stat-value { font-size: 2rem; font-weight: 700; color: #1E293B; }
    .stat-sub { font-size: 0.875rem; color: #64748B; margin-top: 0.25rem; }
  `],
})
export class FacultyDashboardComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard' }];
}
