import { Component, inject, signal } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    ValidatorFn,
    AbstractControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-account-dialog',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './create-account-dialog.html',
    styleUrl: './create-account-dialog.scss',
})
export class CreateAccountDialog {
    readonly dialogRef = inject(MatDialogRef<CreateAccountDialog>);
    private snackBar = inject(MatSnackBar);

    profileForm: FormGroup;
    isLoading = signal<boolean>(false);
    _userService = inject(Auth);

    constructor() {
        this.profileForm = new FormGroup(
            {
                email: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
                password: new FormControl('', [
                    Validators.required,
                    Validators.minLength(6),
                ]),
                confirmPassword: new FormControl('', Validators.required),
                firstName: new FormControl('', Validators.required),
                lastName: new FormControl('', Validators.required),
            },
            { validators: this.passwordMatchValidator() },
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    passwordMatchValidator(): ValidatorFn {
        return (form: AbstractControl): { [key: string]: any } | null => {
            const password = form.get('password');
            const confirmPassword = form.get('confirmPassword');
            if (
                password &&
                confirmPassword &&
                password.value !== confirmPassword.value
            ) {
                confirmPassword.setErrors({ passwordMismatch: true });
                return { passwordMismatch: true };
            }
            return null;
        };
    }

    get f() {
        return this.profileForm.controls;
    }

    onSubmit() {
        if (this.profileForm.invalid) {
            this.markFormGroupTouched();
            return;
        }
        this.isLoading.set(true);
        const userData = {
            email: this.f['email'].value,
            password: this.f['password'].value,
            first_name: this.f['firstName'].value,
            last_name: this.f['lastName'].value,
        };
        this._userService.createUser(userData).subscribe({
            next: () => {
                this.dialogRef.close();
                this.snackBar.open(
                    'Account Created! Please verify your email',
                    'Close',
                    { panelClass: 'snackbar-info' },
                );
            },
            error: (res) => {
                this.isLoading.set(false);
                this.snackBar.open(
                    'Error creating account: ' + res.error.error,
                    'Close',
                    {
                        panelClass: 'snackbar-error',
                    },
                );
            },
        });
    }

    private markFormGroupTouched() {
        Object.keys(this.profileForm.controls).forEach((key) => {
            const control = this.profileForm.get(key);
            control?.markAsTouched();
        });
    }

    // Helper methods for template
    isFieldInvalid(fieldName: string): boolean {
        const field = this.profileForm.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    getFieldError(fieldName: string): string {
        const field = this.profileForm.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) return `${fieldName} is required`;
            if (field.errors['email']) return 'Please enter a valid email';
            if (field.errors['minlength'])
                return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
            if (field.errors['passwordMismatch'])
                return 'Passwords do not match';
        }
        return '';
    }
}
