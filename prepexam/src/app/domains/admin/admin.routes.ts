import { Routes } from '@angular/router';

export const ADMIN_DOMAIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then((m) => m.AdminUsersComponent),
  },
  {
    path: 'faculty',
    loadComponent: () => import('./faculty-management/faculty-management.component').then((m) => m.AdminFacultyManagementComponent),
  },
  {
    path: 'students',
    loadComponent: () => import('./students/students.component').then((m) => m.AdminStudentsComponent),
  },
  {
    path: 'exams',
    loadComponent: () => import('./exams/exams.component').then((m) => m.AdminExamsComponent),
  },
  {
    path: 'subjects',
    loadComponent: () => import('./subject-management/subject-management.component').then((m) => m.AdminSubjectManagementComponent),
  },
  {
    path: 'permissions',
    loadComponent: () => import('./permissions/permissions.component').then((m) => m.AdminPermissionsComponent),
  },
  {
    path: 'subscriptions',
    loadComponent: () => import('./subscriptions/subscriptions.component').then((m) => m.AdminSubscriptionsComponent),
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments.component').then((m) => m.AdminPaymentsComponent),
  },
  {
    path: 'coupons',
    loadComponent: () => import('./coupons/coupons.component').then((m) => m.AdminCouponsComponent),
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then((m) => m.AdminAnalyticsComponent),
  },
  {
    path: 'audit-logs',
    loadComponent: () => import('./audit-logs/audit-logs.component').then((m) => m.AdminAuditLogsComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then((m) => m.AdminSettingsComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
