import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { StudentLayout } from './layouts/student-layout/student-layout';
import { FacultyLayout } from './layouts/faculty-layout/faculty-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { ErrorLayout } from './layouts/error-layout/error-layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  //---------------------------------------
  // AUTH
  //---------------------------------------
  {
    path: '',
    component: AuthLayout,
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  //---------------------------------------
  // STUDENT PORTAL
  //---------------------------------------
  {
    path: ':exam',
    component: StudentLayout,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_STUDENT' },
    loadChildren: () =>
      import('./domains/student/student.routes').then((m) => m.STUDENT_DOMAIN_ROUTES),
  },

  //---------------------------------------
  // FACULTY PORTAL
  //---------------------------------------
  {
    path: 'faculty',
    component: FacultyLayout,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_FACULTY' },
    loadChildren: () =>
      import('./domains/faculty/faculty.routes').then((m) => m.FACULTY_DOMAIN_ROUTES),
  },

  //---------------------------------------
  // ADMIN PORTAL
  //---------------------------------------
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_ADMIN' },
    loadChildren: () =>
      import('./domains/admin/admin.routes').then((m) => m.ADMIN_DOMAIN_ROUTES),
  },

  //---------------------------------------
  // ERROR
  //---------------------------------------
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./layouts/error-layout/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
