import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DataService } from '../services/data';

export const authGuard: CanActivateFn = (route, state) => {
  const dataService = inject(DataService);
  const router = inject(Router);
  
  const currentUser = dataService.getCurrentUser();
  
  if (currentUser) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
