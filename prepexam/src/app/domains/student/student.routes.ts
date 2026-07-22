import { Routes } from '@angular/router';

export const STUDENT_DOMAIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.StudentDashboardComponent),
  },
  {
    path: 'assessment',
    loadComponent: () => import('./assessment/assessment.component').then((m) => m.StudentAssessmentComponent),
  },
  {
    path: 'mock',
    loadComponent: () => import('./mock/mock.component').then((m) => m.StudentMockComponent),
  },
  {
    path: 'practice',
    loadComponent: () => import('./practice/practice.component').then((m) => m.StudentPracticeComponent),
  },
  {
    path: 'ai-chat',
    loadComponent: () => import('./ai/ai-chat.component').then((m) => m.StudentAiChatComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then((m) => m.StudentReportsComponent),
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./dashboard/leaderboard.component').then((m) => m.StudentLeaderboardComponent),
  },
  {
    path: 'bookmarks',
    loadComponent: () => import('./bookmarks/bookmarks.component').then((m) => m.StudentBookmarksComponent),
  },
  {
    path: 'revision',
    loadComponent: () => import('./revision/revision.component').then((m) => m.StudentRevisionComponent),
  },
  {
    path: 'weak-areas',
    loadComponent: () => import('./weak-areas/weak-areas.component').then((m) => m.StudentWeakAreasComponent),
  },
  {
    path: 'achievements',
    loadComponent: () => import('./achievements/achievements.component').then((m) => m.StudentAchievementsComponent),
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history.component').then((m) => m.HistoryComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then((m) => m.StudentProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then((m) => m.StudentSettingsComponent),
  },
  {
    path: 'test/:testType/:id',
    loadComponent: () => import('../../shared/components/test-page/test-page').then((m) => m.TestPage),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
