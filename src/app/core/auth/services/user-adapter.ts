import { Injectable } from '@angular/core';
import { UserData } from '../../../repository/types/user-data';
import { UserProfile } from '../../../models/user-profile';
import { UserRole } from '../../../models/enums/user-profile-enum';

@Injectable({
    providedIn: 'root',
})
export class UserAdapter {
    fromData(userData: UserData): UserProfile {
        return {
            userId: userData.user_id || '',
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: (userData.role as UserRole) || UserRole.USER,
        };
    }
}
