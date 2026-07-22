import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../auth/token.service';

export const roleGuard: CanActivateFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as string;
  const userRole = tokenService.getRole();

  if (userRole === expectedRole) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
