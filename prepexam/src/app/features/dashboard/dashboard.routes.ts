import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [

{
  path: 'dashboard',
  loadComponent: () =>
    import('./pages/dashboard/dashboard')
      .then(m => m.Dashboard)
},

  {
    path: 'assessment',
    loadComponent: () =>
      import('./pages/assessment/assessment')
      .then(m => m.Assessment)
  },

  {
    path: 'ai-chat',
    loadComponent: () =>
      import('./pages/ai-chat/ai-chat')
      .then(m => m.AiChat)
  },

  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports')
      .then(m => m.Reports)
  },

  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./pages/leaderboard/leaderboard')
      .then(m => m.Leaderboard)
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile')
      .then(m => m.Profile)
  },

  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications')
      .then(m => m.Notifications)
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings')
      .then(m => m.Settings)
  }

];