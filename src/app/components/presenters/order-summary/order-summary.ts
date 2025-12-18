import { Component, Input } from '@angular/core';
import { CartItem } from '../../../models/cart';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-order-summary',
    imports: [MatDividerModule],
    templateUrl: './order-summary.html',
    styleUrls: ['./order-summary.scss'],
})
export class OrderSummary {
    @Input() items: CartItem[] = [];
    @Input() subtotal: number = 0;
    @Input() total: number = 0;
}
