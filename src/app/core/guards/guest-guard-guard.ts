import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '../../shared';

export const GuestGuard: CanActivateFn = (route, state) => {

  const user = inject(UserStore)
  const router = inject(Router)

  if(user.authenticated()){
    return router.parseUrl('/home');
  }

  return true;
};
