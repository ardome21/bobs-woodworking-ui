import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthApi } from '../../../repository/services/auth-api';

@Component({
    selector: 'app-manage-users',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
    ],
    templateUrl: './manage-users.html',
    styleUrl: './manage-users.scss',
})
export class ManageUsers {
    private readonly authApiService = inject(AuthApi);
    private readonly snackBar = inject(MatSnackBar);

    userIdInput = '';
    promoting = false;
    promotedUser: any = null;

    promoteUser(): void {
        if (!this.userIdInput.trim()) {
            this.snackBar.open('Please enter a User ID', 'Close', { duration: 3000 });
            return;
        }

        if (this.promoting) {
            return;
        }

        this.promoting = true;
        this.promotedUser = null;

        this.authApiService.promoteUserToAdmin(this.userIdInput.trim()).subscribe({
            next: (response) => {
                this.promoting = false;
                this.promotedUser = response.user;
                this.snackBar.open(
                    `User ${response.user.user_id} promoted to admin successfully!`,
                    'Close',
                    { duration: 5000 }
                );
                this.userIdInput = '';
            },
            error: (error) => {
                this.promoting = false;
                const message = error.error?.error || 'Failed to promote user';
                this.snackBar.open(message, 'Close', { duration: 5000 });
            },
        });
    }
}
