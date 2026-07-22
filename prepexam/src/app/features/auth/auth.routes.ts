import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register').then((m) => m.Register),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'student/onboarding',
    loadComponent: () =>
      import('./onboarding/onboarding').then((m) => m.Onboarding),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_STUDENT' },
  },
];
