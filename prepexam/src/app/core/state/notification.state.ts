import { Injectable, signal } from '@angular/core';
import { NotificationDto } from '../api/dto/user.dto';

@Injectable({ providedIn: 'root' })
export class NotificationState {
  private _notifications = signal<NotificationDto[]>([]);
  private _unreadCount = signal(0);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();

  setNotifications(notifications: NotificationDto[]): void {
    this._notifications.set(notifications);
    this._unreadCount.set(notifications.filter((n) => !n.isRead).length);
  }

  markAsRead(notificationId: string): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    this._unreadCount.update((count) => Math.max(0, count - 1));
  }

  addNotification(notification: NotificationDto): void {
    this._notifications.update((list) => [notification, ...list]);
    if (!notification.isRead) {
      this._unreadCount.update((count) => count + 1);
    }
  }

  clear(): void {
    this._notifications.set([]);
    this._unreadCount.set(0);
  }
}
