import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../../models/cart';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-cart-list',
    imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
    templateUrl: './cart-list.html',
    styleUrls: ['./cart-list.scss'],
})
export class CartList {
    @Input() cartItems: CartItem[] = [];
    @Output() itemRemoved = new EventEmitter<number>();

    removeItem(productId: number): void {
        this.itemRemoved.emit(productId);
    }
}
