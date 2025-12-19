import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { Order } from '../../../models/order';

@Component({
    selector: 'app-order-confirmation-presenter',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        RouterModule,
    ],
    templateUrl: './order-confirmation.html',
    styleUrls: ['./order-confirmation.scss'],
})
export class OrderConfirmationPresenter {
    @Input() order: Order | null = null;
}
