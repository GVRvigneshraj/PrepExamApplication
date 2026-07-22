import { Routes } from '@angular/router';

export const FACULTY_DOMAIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.FacultyDashboardComponent),
  },
  {
    path: 'question-bank',
    loadComponent: () => import('./question-bank/question-bank.component').then((m) => m.FacultyQuestionBankComponent),
  },
  {
    path: 'question-approval',
    loadComponent: () => import('./question-approval/question-approval.component').then((m) => m.FacultyQuestionApprovalComponent),
  },
  {
    path: 'mock-builder',
    loadComponent: () => import('./mock-builder/mock-builder.component').then((m) => m.FacultyMockBuilderComponent),
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then((m) => m.FacultyAnalyticsComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then((m) => m.FacultyReportsComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/faculty-profile.component').then((m) => m.FacultyProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/faculty-settings.component').then((m) => m.FacultySettingsComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
