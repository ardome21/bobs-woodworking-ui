import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-admin-elevation-success',
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
    templateUrl: './admin-elevation-success.html',
    styleUrl: './admin-elevation-success.scss',
})
export class AdminElevationSuccess implements OnInit {
    alreadyAdmin = false;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.alreadyAdmin = params['already_admin'] === 'true';
        });
    }
}
