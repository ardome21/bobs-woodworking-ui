import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { switchMap, map, take } from 'rxjs/operators';
import { UserRole } from '../../../models/enums/user-profile-enum';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    private _authService = inject(Auth);
    private _router = inject(Router);

    canActivate(requiredRoles?: UserRole[]): ReturnType<CanActivateFn> {
        return this._authService.authChecked$.pipe(
            take(1),
            switchMap(() => this._authService.userProfile$),
            take(1),
            map((userProfile) => {
                if (!userProfile) {
                    this._router.navigate(['/home']);
                    return false;
                }

                if (
                    requiredRoles &&
                    !requiredRoles.includes(userProfile.role)
                ) {
                    this._router.navigate(['/home']);
                    return false;
                }

                return true;
            }),
        );
    }
}

export const authGuard: CanActivateFn = (route, state) => {
    const authGuard = inject(AuthGuard);
    return authGuard.canActivate();
};

export const adminGuard: CanActivateFn = (route, state) => {
    const authGuard = inject(AuthGuard);
    return authGuard.canActivate([UserRole.ADMIN]);
};
