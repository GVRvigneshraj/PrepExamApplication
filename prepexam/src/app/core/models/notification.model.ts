export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder';
  icon: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationPreference {
  pushEnabled: boolean;
  emailEnabled: boolean;
  reminderEnabled: boolean;
  dailyPracticeReminder: boolean;
  mockTestReminder: boolean;
  achievementAlerts: boolean;
  weeklyReport: boolean;
}
