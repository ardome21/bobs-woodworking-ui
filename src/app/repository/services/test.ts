import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class Test {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    testTokenChecks() {
        return this.http.get(this.baseUrl + '/auth-and-validate');
    }
}
