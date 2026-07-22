import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Platform Analytics</h1>
    </div>

    <div class="analytics-grid">
      <app-card title="User Growth" variant="elevated">
        <p>Charts will be rendered here.</p>
      </app-card>
      <app-card title="Revenue Analytics" variant="elevated">
        <p>Revenue charts will be rendered here.</p>
      </app-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
  `],
})
export class AdminAnalyticsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Analytics' }];
}
