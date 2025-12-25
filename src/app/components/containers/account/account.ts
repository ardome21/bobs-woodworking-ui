import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/auth/services/auth';
import { UserRole } from '../../../models/enums/user-profile-enum';
import { AuthApi } from '../../../repository/services/auth-api';

@Component({
    selector: 'app-account',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './account.html',
    styleUrl: './account.scss',
})
export class Account {
    private readonly authService = inject(Auth);
    private readonly authApiService = inject(AuthApi);
    private readonly snackBar = inject(MatSnackBar);

    userProfile$ = this.authService.userProfile$;
    readonly UserRole = UserRole;

    requesting = false;

    copyUserId(userId: string): void {
        navigator.clipboard.writeText(userId).then(() => {
            this.snackBar.open('User ID copied to clipboard!', 'Close', {
                duration: 3000,
            });
        });
    }

    requestAdminElevation(): void {
        if (this.requesting) {
            return;
        }

        this.requesting = true;

        this.authApiService.requestAdminElevation().subscribe({
            next: (response) => {
                this.requesting = false;
                this.snackBar.open(
                    'Admin elevation request sent! An administrator will review your request.',
                    'Close',
                    { duration: 5000 }
                );
            },
            error: (error) => {
                this.requesting = false;
                const message = error.error?.error || 'Failed to send admin elevation request';
                this.snackBar.open(message, 'Close', { duration: 5000 });
            },
        });
    }
}
