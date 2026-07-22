import { Injectable } from '@angular/core';
import { TokenService } from '../auth/token.service';
import { Permission } from './permission.enum';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ROLE_STUDENT: [
    Permission.STUDENT_VIEW_DASHBOARD,
    Permission.STUDENT_TAKE_ASSESSMENT,
    Permission.STUDENT_VIEW_REPORTS,
    Permission.STUDENT_USE_AI_TUTOR,
    Permission.STUDENT_MANAGE_BOOKMARKS,
  ],
  ROLE_FACULTY: [
    Permission.FACULTY_VIEW_DASHBOARD,
    Permission.FACULTY_MANAGE_QUESTIONS,
    Permission.FACULTY_APPROVE_QUESTIONS,
    Permission.FACULTY_BUILD_MOCK,
    Permission.FACULTY_VIEW_STUDENT_ANALYTICS,
  ],
  ROLE_ADMIN: Object.values(Permission),
};

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private tokenService: TokenService) {}

  hasPermission(permission: Permission): boolean {
    const role = this.tokenService.getRole();
    if (!role) return false;
    const perms = ROLE_PERMISSIONS[role];
    return perms ? perms.includes(permission) : false;
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  getRolePermissions(): Permission[] {
    const role = this.tokenService.getRole();
    if (!role) return [];
    return ROLE_PERMISSIONS[role] ?? [];
  }
}
