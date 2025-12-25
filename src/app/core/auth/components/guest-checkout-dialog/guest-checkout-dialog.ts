import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-guest-checkout-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
    ],
    template: `
        <h2 mat-dialog-title>Continue as Guest</h2>
        <mat-dialog-content>
            <p class="description">
                Enter your information to continue with checkout. You won't need to create
                an account.
            </p>

            <form [formGroup]="guestForm">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input
                        matInput
                        type="email"
                        formControlName="email"
                        placeholder="your@email.com"
                        required
                    />
                    @if (guestForm.get('email')?.hasError('required') && guestForm.get('email')?.touched) {
                        <mat-error>Email is required</mat-error>
                    }
                    @if (guestForm.get('email')?.hasError('email') && guestForm.get('email')?.touched) {
                        <mat-error>Please enter a valid email</mat-error>
                    }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>First Name</mat-label>
                    <input
                        matInput
                        type="text"
                        formControlName="first_name"
                        placeholder="John"
                        required
                    />
                    @if (guestForm.get('first_name')?.hasError('required') && guestForm.get('first_name')?.touched) {
                        <mat-error>First name is required</mat-error>
                    }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Last Name</mat-label>
                    <input
                        matInput
                        type="text"
                        formControlName="last_name"
                        placeholder="Doe"
                        required
                    />
                    @if (guestForm.get('last_name')?.hasError('required') && guestForm.get('last_name')?.touched) {
                        <mat-error>Last name is required</mat-error>
                    }
                </mat-form-field>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close [disabled]="isLoading()">Cancel</button>
            <button
                mat-raised-button
                color="primary"
                (click)="continueAsGuest()"
                [disabled]="guestForm.invalid || isLoading()"
            >
                @if (isLoading()) {
                    <mat-spinner diameter="20"></mat-spinner>
                } @else {
                    Continue to Checkout
                }
            </button>
        </mat-dialog-actions>
    `,
    styles: [
        `
            .description {
                margin-bottom: 1rem;
                color: rgba(0, 0, 0, 0.6);
            }

            mat-form-field {
                display: block;
                margin-bottom: 1rem;
            }

            .full-width {
                width: 100%;
            }

            mat-dialog-content {
                min-width: 400px;
                padding: 1.5rem;
            }

            mat-dialog-actions {
                padding: 1rem 1.5rem;
            }

            button mat-spinner {
                display: inline-block;
                margin: 0 auto;
            }
        `,
    ],
})
export class GuestCheckoutDialog {
    private authService = inject(Auth);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);
    private dialogRef = inject(MatDialogRef<GuestCheckoutDialog>);

    isLoading = signal(false);

    guestForm: FormGroup;

    constructor() {
        this.guestForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            first_name: ['', [Validators.required, Validators.minLength(1)]],
            last_name: ['', [Validators.required, Validators.minLength(1)]],
        });
    }

    continueAsGuest(): void {
        if (this.guestForm.invalid) {
            return;
        }

        this.isLoading.set(true);

        const guestData = {
            email: this.guestForm.value.email.trim(),
            first_name: this.guestForm.value.first_name.trim(),
            last_name: this.guestForm.value.last_name.trim(),
        };

        this.authService.loginAsGuest(guestData).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.snackBar.open('Ready to checkout!', 'Close', {
                    duration: 3000,
                });
                this.dialogRef.close(true);
            },
            error: (error) => {
                this.isLoading.set(false);
                const errorMessage =
                    error?.error?.error || 'Failed to continue as guest. Please try again.';
                this.snackBar.open(errorMessage, 'Close', {
                    duration: 5000,
                    panelClass: ['error-snackbar'],
                });
            },
        });
    }
}
