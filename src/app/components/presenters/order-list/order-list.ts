import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Order } from '../../../models/order';

@Component({
    selector: 'app-order-list',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
    ],
    templateUrl: './order-list.html',
    styleUrls: ['./order-list.scss'],
})
export class OrderList {
    @Input() orders: Order[] = [];
}
