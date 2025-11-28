import { inject, Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    map,
    Observable,
    of,
    ReplaySubject,
    tap,
} from 'rxjs';
import { UserData } from '../../../repository/types/user-data';
import { UserProfile } from '../../../models/user-profile';
import { UserAdapter } from './user-adapter';
import { AuthApi } from '../../../repository/services/auth-api';

@Injectable({
    providedIn: 'root',
})
export class Auth {
    private _userProfile = new BehaviorSubject<UserProfile | null>(null);
    public userProfile$ = this._userProfile.asObservable();

    private _authChecked = new ReplaySubject<boolean>(1);
    public authChecked$ = this._authChecked.asObservable();

    private _authApiService = inject(AuthApi);
    private _authAdapterService = inject(UserAdapter);

    constructor() {
        this.checkAuthStatus().subscribe({
            next: () => this._authChecked.next(true),
            error: () => this._authChecked.next(true),
        });
    }

    createUser(
        userData: UserData,
    ): Observable<{ message: string; user: UserData; success: string }> {
        return this._authApiService.createUser(userData);
    }

    login(loginData: {
        email: string;
        password: string;
    }): Observable<{ message: string; user: UserData; success: string }> {
        return this._authApiService.login(loginData).pipe(
            tap((res) => {
                const userProfile = this._authAdapterService.fromData(res.user);
                this._userProfile.next(userProfile);
            }),
        );
    }

    logout(): void {
        this._authApiService.logout().subscribe(() => {
            this._userProfile.next(null);
        });
    }

    checkAuthStatus(): Observable<UserProfile | null> {
        return this._authApiService.verifyAuth().pipe(
            tap((res) => {
                if (res.success === 'true') {
                    const userProfile = this._authAdapterService.fromData(
                        res.userData,
                    );
                    this._userProfile.next(userProfile);
                } else {
                    this._userProfile.next(null);
                }
            }),
            map((res) =>
                res.success === 'true'
                    ? this._authAdapterService.fromData(res.userData)
                    : null,
            ),
            catchError(() => {
                this._userProfile.next(null);
                return of(null);
            }),
        );
    }
}
