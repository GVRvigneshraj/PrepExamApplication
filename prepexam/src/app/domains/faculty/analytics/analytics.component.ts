import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-faculty-analytics',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Student Analytics</h1>
    </div>

    <div class="analytics-grid">
      <app-card title="Performance Overview" variant="elevated">
        <div class="analytics-content">
          <p>Charts and analytics will be displayed here using Chart.js / ng2-charts.</p>
        </div>
      </app-card>

      <app-card title="Student Progress" variant="elevated">
        <div class="analytics-content">
          <p>Student-wise progress tracking will be shown here.</p>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
    .analytics-content { color: #64748B; }
  `],
})
export class FacultyAnalyticsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Analytics' }];
}
