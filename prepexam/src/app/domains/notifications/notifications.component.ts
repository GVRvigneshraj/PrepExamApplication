import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { NotificationState } from '../../core/state/notification.state';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, BadgeComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Notifications</h1>
    </div>

    <app-card variant="elevated">
      <div class="notification-list">
        @for (notif of notifications(); track notif.id) {
          <div [class]="'notification-item ' + (notif.read ? '' : 'unread')">
            <div class="notif-icon">
              <i [class]="'fas ' + getIcon(notif.type)"></i>
            </div>
            <div class="notif-content">
              <h4>{{ notif.title }}</h4>
              <p>{{ notif.message }}</p>
              <span class="notif-time">{{ notif.time }}</span>
            </div>
          </div>
        }
      </div>
    </app-card>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .notification-list { display: flex; flex-direction: column; }
    .notification-item { display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #F1F5F9; }
    .notification-item.unread { background: #EEF2FF; margin: 0 -1.5rem; padding: 1rem 1.5rem; border-radius: 0.5rem; }
    .notif-icon { width: 2.5rem; height: 2.5rem; background: #EEF2FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #6366F1; flex-shrink: 0; }
    .notif-content { flex: 1; }
    .notif-content h4 { margin: 0 0 0.25rem; font-size: 0.875rem; font-weight: 600; }
    .notif-content p { margin: 0 0 0.25rem; font-size: 0.875rem; color: #64748B; }
    .notif-time { font-size: 0.75rem; color: #94A3B8; }
  `],
})
export class NotificationsComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Notifications' }];

  notifications = signal([
    { id: '1', title: 'New Assessment Available', message: 'Physics Chapter Test 5 is now available.', type: 'info', read: false, time: '2h ago' },
    { id: '2', title: 'Mock Test Results', message: 'Your NEET Mock 12 results are ready.', type: 'success', read: false, time: '5h ago' },
    { id: '3', title: 'Reminder', message: 'Complete your daily practice set.', type: 'warning', read: true, time: '1d ago' },
  ]);

  getIcon(type: string): string {
    const icons: Record<string, string> = { info: 'fa-info-circle', success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle' };
    return icons[type] || icons['info'];
  }
}
