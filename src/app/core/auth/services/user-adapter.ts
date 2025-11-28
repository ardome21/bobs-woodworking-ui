import { Injectable } from '@angular/core';
import { UserData } from '../../../repository/types/user-data';
import { UserProfile } from '../../../models/user-profile';

@Injectable({
    providedIn: 'root',
})
export class UserAdapter {
    fromData(userData: UserData): UserProfile {
        return {
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
        };
    }
}
