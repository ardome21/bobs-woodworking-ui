// auth.interceptor.ts
import {
    HttpInterceptorFn,
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    catchError,
    switchMap,
    throwError,
    BehaviorSubject,
    filter,
    take,
    Observable,
} from 'rxjs';
import { Auth } from '../services/auth';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth);
    const router = inject(Router);

    let authReq = req;

    const token = authService.getAccessToken;
    console.log('AuthInterceptor - attaching token:', token);
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
    } else {
        authReq = req.clone({ withCredentials: true });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return handle401Error(authReq, next, authService, router);
            } else if (error.status === 403) {
                console.error('Forbidden: Insufficient permissions');
            }

            return throwError(() => error);
        }),
    );
};

function handle401Error(
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: Auth,
    router: Router,
): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshAccessToken().pipe(
            switchMap((response) => {
                isRefreshing = false;
                const newToken = response.access_token || '';
                refreshTokenSubject.next(newToken);
                const authReq = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${newToken}`,
                    },
                });

                return next(authReq);
            }),
            catchError((err) => {
                isRefreshing = false;

                // Refresh token expired - logout
                console.error('Refresh token expired, logging out...');
                authService.logout();
                router.navigate(['/login']);

                return throwError(() => err);
            }),
        );
    } else {
        // Another request is already refreshing, wait for it
        return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
                const authReq = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token!}`, // Non-null assertion is safe here
                    },
                });
                return next(authReq);
            }),
        );
    }
}
