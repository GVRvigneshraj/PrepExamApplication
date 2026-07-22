import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>User Management</h1>
      <app-button size="sm">+ Add User</app-button>
    </div>

    <app-card variant="elevated">
      <div class="user-list">
        @for (user of users(); track user.id) {
          <div class="user-row">
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
            <app-badge [text]="user.role" variant="primary" />
            <app-button variant="secondary" size="sm">Edit</app-button>
          </div>
        }
      </div>
    </app-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .user-list { display: flex; flex-direction: column; }
    .user-row { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #F1F5F9; }
    .user-info { flex: 1; display: flex; flex-direction: column; }
    .user-name { font-weight: 500; }
    .user-email { font-size: 0.875rem; color: #64748B; }
  `],
})
export class AdminUsersComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'User Management' }];

  users = signal([
    { id: '1', name: 'Ravi Kumar', email: 'ravi@example.com', role: 'Student' },
    { id: '2', name: 'Dr. Priya', email: 'priya@example.com', role: 'Faculty' },
    { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
  ]);
}
