import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-confirmation-success',
    templateUrl: './confirmation-success.component.html',
    styleUrl: './confirmation-success.component.scss',
    imports: [CommonModule],
})
export class ConfirmationSuccess implements OnInit {
    userEmail: string = '';
    alreadyConfirmed = signal<boolean>(false);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.userEmail = params['email'] || '';
            if (params['already_confirmed']) {
                this.alreadyConfirmed.set(true);
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/']);
    }
}
