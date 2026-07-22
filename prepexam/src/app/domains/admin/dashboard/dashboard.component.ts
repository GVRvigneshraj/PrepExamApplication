import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Admin Dashboard</h1>
      <p>Platform overview and management</p>
    </div>

    <div class="stats-grid">
      <app-card title="Total Students" variant="elevated">
        <div class="stat-value">12,450</div>
        <div class="stat-sub">+120 this month</div>
      </app-card>

      <app-card title="Total Faculty" variant="elevated">
        <div class="stat-value">85</div>
        <div class="stat-sub">Across all subjects</div>
      </app-card>

      <app-card title="Active Exams" variant="elevated">
        <div class="stat-value">9</div>
        <div class="stat-sub">NEET, JEE, UPSC...</div>
      </app-card>

      <app-card title="Revenue" variant="elevated">
        <div class="stat-value">₹4.2L</div>
        <div class="stat-sub">This month</div>
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
export class AdminDashboardComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard' }];
}
