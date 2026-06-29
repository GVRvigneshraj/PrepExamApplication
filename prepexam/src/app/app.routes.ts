import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  //---------------------------------------
  // AUTH
  //---------------------------------------

  {
    path: '',
    component: AuthLayout,
    loadChildren: () =>
      import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },

  //---------------------------------------
  // EXAMS
  //---------------------------------------

  {
    path: ':exam',
    component: DashboardLayout,
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  },

  //---------------------------------------

  {
    path: '**',
    redirectTo: 'login'
  }

];