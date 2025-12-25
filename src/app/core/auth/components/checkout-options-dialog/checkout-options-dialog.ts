import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { LoginDialog } from '../login-dialog/login-dialog';
import { GuestCheckoutDialog } from '../guest-checkout-dialog/guest-checkout-dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-checkout-options-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
    ],
    template: `
        <h2 mat-dialog-title>Checkout Options</h2>
        <mat-dialog-content>
            <p class="description">
                Choose how you'd like to proceed with your order
            </p>

            <div class="options-container">
                <button
                    mat-raised-button
                    color="primary"
                    class="option-button"
                    (click)="openLogin()"
                >
                    <mat-icon>login</mat-icon>
                    <div class="button-content">
                        <span class="button-title">Login</span>
                        <span class="button-subtitle">Use your existing account</span>
                    </div>
                </button>

                <button
                    mat-raised-button
                    color="accent"
                    class="option-button"
                    (click)="createAccount()"
                >
                    <mat-icon>person_add</mat-icon>
                    <div class="button-content">
                        <span class="button-title">Create Account</span>
                        <span class="button-subtitle">Sign up for faster checkout</span>
                    </div>
                </button>

                <mat-divider></mat-divider>

                <button
                    mat-stroked-button
                    class="option-button guest-button"
                    (click)="continueAsGuest()"
                >
                    <mat-icon>shopping_cart</mat-icon>
                    <div class="button-content">
                        <span class="button-title">Continue as Guest</span>
                        <span class="button-subtitle">No account needed</span>
                    </div>
                </button>
            </div>
        </mat-dialog-content>

        <mat-dialog-actions align="center">
            <button mat-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Go Back
            </button>
        </mat-dialog-actions>
    `,
    styles: [
        `
            .description {
                margin-bottom: 1.5rem;
                color: rgba(0, 0, 0, 0.6);
                text-align: center;
            }

            mat-dialog-content {
                min-width: 450px;
                padding: 1.5rem;
            }

            .options-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .option-button {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 1.25rem 1.5rem;
                text-align: left;
                height: auto;
                gap: 1rem;
            }

            .option-button mat-icon {
                font-size: 32px;
                width: 32px;
                height: 32px;
            }

            .button-content {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .button-title {
                font-size: 16px;
                font-weight: 500;
            }

            .button-subtitle {
                font-size: 13px;
                opacity: 0.8;
                font-weight: 400;
            }

            mat-divider {
                margin: 0.5rem 0;
            }

            .guest-button {
                border: 2px dashed rgba(0, 0, 0, 0.2);
            }

            mat-dialog-actions {
                padding: 1rem 1.5rem;
                justify-content: center;
            }

            mat-dialog-actions button {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            mat-dialog-actions button mat-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
            }
        `,
    ],
})
export class CheckoutOptionsDialog {
    private dialog = inject(MatDialog);
    private dialogRef = inject(MatDialogRef<CheckoutOptionsDialog>);
    private router = inject(Router);

    openLogin(): void {
        this.dialogRef.close();
        const loginDialogRef = this.dialog.open(LoginDialog, {
            width: '400px',
        });

        loginDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // User successfully logged in
                this.dialogRef.close(true);
            }
        });
    }

    createAccount(): void {
        this.dialogRef.close();
        this.router.navigate(['/sign-up']);
    }

    continueAsGuest(): void {
        this.dialogRef.close();
        const guestDialogRef = this.dialog.open(GuestCheckoutDialog, {
            width: '450px',
            disableClose: false,
        });

        guestDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Guest successfully created token
                this.dialogRef.close(true);
            }
        });
    }

    goBack(): void {
        this.dialogRef.close(false);
        this.router.navigate(['/cart']);
    }
}
