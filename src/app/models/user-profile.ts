import { UserRole } from './enums/user-profile-enum';

export type UserProfile = {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
};
