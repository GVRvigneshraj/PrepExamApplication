export interface RouteConfig {
  path: string;
  label: string;
  icon: string;
  children?: RouteConfig[];
  permissions?: string[];
  isHidden?: boolean;
}

export const STUDENT_ROUTES: RouteConfig[] = [
  { path: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
  { path: 'assessment', label: 'Assessment', icon: 'fas fa-clipboard-check' },
  { path: 'mock', label: 'Mock Test', icon: 'fas fa-file-alt' },
  { path: 'practice', label: 'Practice', icon: 'fas fa-dumbbell' },
  { path: 'ai-chat', label: 'AI Tutor', icon: 'fas fa-robot' },
  { path: 'reports', label: 'Reports', icon: 'fas fa-chart-bar' },
  { path: 'leaderboard', label: 'Leaderboard', icon: 'fas fa-trophy' },
  { path: 'bookmarks', label: 'Bookmarks', icon: 'fas fa-bookmark' },
  { path: 'revision', label: 'Revision', icon: 'fas fa-redo' },
  { path: 'weak-areas', label: 'Weak Areas', icon: 'fas fa-exclamation-circle' },
  { path: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' },
  { path: 'profile', label: 'Profile', icon: 'fas fa-user', isHidden: true },
  { path: 'settings', label: 'Settings', icon: 'fas fa-cog', isHidden: true },
];

export const FACULTY_ROUTES: RouteConfig[] = [
  { path: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
  { path: 'question-bank', label: 'Question Bank', icon: 'fas fa-database' },
  { path: 'question-approval', label: 'Question Approval', icon: 'fas fa-check-double' },
  { path: 'mock-builder', label: 'Mock Builder', icon: 'fas fa-cogs' },
  { path: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
  { path: 'reports', label: 'Reports', icon: 'fas fa-file-report' },
  { path: 'profile', label: 'Profile', icon: 'fas fa-user', isHidden: true },
  { path: 'settings', label: 'Settings', icon: 'fas fa-cog', isHidden: true },
];

export const ADMIN_ROUTES: RouteConfig[] = [
  { path: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
  { path: 'users', label: 'Users', icon: 'fas fa-users' },
  { path: 'faculty', label: 'Faculty', icon: 'fas fa-chalkboard-teacher' },
  { path: 'students', label: 'Students', icon: 'fas fa-user-graduate' },
  { path: 'exams', label: 'Exams', icon: 'fas fa-file-alt' },
  { path: 'subjects', label: 'Subjects', icon: 'fas fa-book' },
  { path: 'permissions', label: 'Permissions', icon: 'fas fa-shield-alt' },
  { path: 'subscriptions', label: 'Subscriptions', icon: 'fas fa-credit-card' },
  { path: 'payments', label: 'Payments', icon: 'fas fa-money-bill-wave' },
  { path: 'coupons', label: 'Coupons', icon: 'fas fa-tag' },
  { path: 'analytics', label: 'Analytics', icon: 'fas fa-chart-pie' },
  { path: 'audit-logs', label: 'Audit Logs', icon: 'fas fa-history' },
  { path: 'settings', label: 'Settings', icon: 'fas fa-cog', isHidden: true },
];
