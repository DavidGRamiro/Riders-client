import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '../../shared';

export const AuthenticateGuard: CanActivateFn = (route, state) => {

  const userStore = inject(UserStore)
  const router = inject(Router)

  const isAuthenticated = userStore.authenticated()
  if (isAuthenticated)
    return true;

  return router.navigate(['/login']);
};
