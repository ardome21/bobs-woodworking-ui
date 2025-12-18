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
    @Output() quantityChanged = new EventEmitter<{ productId: number; quantity: number }>();
    @Output() itemRemoved = new EventEmitter<number>();

    incrementQuantity(productId: number): void {
        const item = this.cartItems.find(i => i.product_id === productId);
        if (item && item.quantity < 99) {
            this.quantityChanged.emit({ productId, quantity: item.quantity + 1 });
        }
    }

    decrementQuantity(productId: number): void {
        const item = this.cartItems.find(i => i.product_id === productId);
        if (item && item.quantity > 1) {
            this.quantityChanged.emit({ productId, quantity: item.quantity - 1 });
        }
    }

    removeItem(productId: number): void {
        this.itemRemoved.emit(productId);
    }
}
