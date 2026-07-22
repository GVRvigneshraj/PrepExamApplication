import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Subscription Plans</h1>
    </div>

    <app-card title="Active Plans" variant="elevated">
      <p>Manage subscription plans, coupons, and payments.</p>
    </app-card>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
  `],
})
export class AdminSubscriptionsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Subscriptions' }];
}
