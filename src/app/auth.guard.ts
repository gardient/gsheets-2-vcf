import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GApiService } from './gapi.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private gapiService: GApiService, private router: Router) { }

  canActivate (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const authenticated = this.gapiService.isAuthenticated();
    if (!authenticated) {
      this.router.navigate(['/']);
    }
    return authenticated;
  }
}
