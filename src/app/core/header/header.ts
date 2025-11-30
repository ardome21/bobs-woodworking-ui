import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../auth/services/auth';
import { CreateAccountDialog } from '../auth/components/create-account-dialog/create-account-dialog';
import { LoginDialog } from '../auth/components/login-dialog/login-dialog';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [RouterModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    @Input() title: string = '';

    readonly dialog = inject(MatDialog);
    private readonly _userService = inject(Auth);

    userProfile$ = this._userService.userProfile$;
    authChecked$ = this._userService.authChecked$;

    pages = [
        { title: 'Home', url: '/home' },
        { title: 'Browse Products', url: '/browse-products' },

        { title: 'Update Inventory', url: '/update-inventory' },
    ];

    openCreateAccountDialog(event?: Event): void {
        if (event && event.target instanceof HTMLElement) {
            event.target.blur();
        }
        this.dialog.open(CreateAccountDialog);
    }

    openLoginDialog(event?: Event): void {
        if (event && event.target instanceof HTMLElement) {
            event.target.blur();
        }
        this.dialog.open(LoginDialog);
    }

    logout(): void {
        this._userService.logout();
    }
}
