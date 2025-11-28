import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-dialog',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
})
export class LoginDialog {
  readonly dialogRef = inject(MatDialogRef<LoginDialog>);
  private snackBar = inject(MatSnackBar);


  profileForm: FormGroup;
  isLoading = false;
  isSuccess = false;

  _userService = inject(Auth)

  constructor() {
    this.profileForm = new FormGroup({
        email: new FormControl('',[Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
      });
    }

    get f() { return this.profileForm.controls; }


    onSubmit() {
      if (this.profileForm.invalid) {
        this.markFormGroupTouched();
        return;
      }
      this.isLoading = true;
      const loginData = {
        email: this.f['email'].value,
        password: this.f['password'].value
      };
      this._userService.login(loginData).subscribe({
      next: () => {
        this.snackBar.open('Login successful!', 'Close', { duration: 3000, panelClass: 'snackbar-success' });
        this.dialogRef.close()
      },
      error: (res) => {
        this.isLoading = false;
        this.snackBar.open('Login failed: ' + res.error.error, 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error'
        });
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
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
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
