import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-admin-permissions',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Permission Management</h1>
    </div>

    <app-card title="Role Permissions" variant="elevated">
      <p>Configure role-based access control for Student, Faculty, and Admin portals.</p>
    </app-card>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
  `],
})
export class AdminPermissionsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Permissions' }];
}
