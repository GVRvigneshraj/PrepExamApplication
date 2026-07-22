import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>System Settings</h1>
    </div>

    <app-card title="Application Settings" variant="elevated">
      <p>Configure application-wide settings, feature flags, and system preferences.</p>
      <app-button variant="secondary" style="margin-top: 1rem;">Save Changes</app-button>
    </app-card>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
  `],
})
export class AdminSettingsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Settings' }];
}
