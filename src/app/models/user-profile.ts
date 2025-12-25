import { UserRole } from './enums/user-profile-enum';

export type UserProfile = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
};
