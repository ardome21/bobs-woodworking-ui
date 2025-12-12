import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../types/user-data';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthApi {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    createUser(
        userData: UserData,
    ): Observable<{ message: string; user: UserData; success: string }> {
        const payload = {
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            password: userData.password,
        };
        return this.http.post<{
            message: string;
            user: UserData;
            success: string;
        }>(this.baseUrl + '/sign-up', payload);
    }

    login(loginData: { email: string; password: string }): Observable<{
        message: string;
        access_token: string;
        user: UserData;
        success: string;
    }> {
        const payload = {
            email: loginData.email,
            password: loginData.password,
        };
        return this.http.post<{
            message: string;
            access_token: string;
            user: UserData;
            success: string;
        }>(this.baseUrl + '/login', payload);
    }

    verifyAuth(): Observable<{
        message: string;
        access_token: string;
        user: UserData;
        success: boolean;
    }> {
        return this.http.get<{
            message: string;
            access_token: string;
            user: UserData;
            success: boolean;
        }>(this.baseUrl + '/login');
    }

    logout(): Observable<{ success: string; message: string }> {
        return this.http.post<{ success: string; message: string }>(
            this.baseUrl + '/logout',
            {},
        );
    }
}
