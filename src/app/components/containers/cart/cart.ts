import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart';
import { CartItem } from '../../../models/cart';
import { CartList } from '../../presenters/cart-list/cart-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-cart',
    imports: [CartList, MatCardModule, MatButtonModule, MatDividerModule, RouterModule],
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss'],
})
export class Cart implements OnInit {
    cartItems: CartItem[] = [];
    subtotal: number = 0;
    total: number = 0;
    itemCount: number = 0;

    private cartService = inject(CartService);
    private snackBar = inject(MatSnackBar);

    ngOnInit(): void {
        this.cartService.cart$.subscribe(items => {
            this.cartItems = items;
            this.calculateTotals();
        });
    }

    onItemRemoved(productId: number): void {
        const item = this.cartItems.find(i => i.product_id === productId);
        if (item) {
            this.cartService.removeFromCart(productId);
            this.snackBar.open(
                `Removed ${item.product_name} from cart`,
                'Close',
                { duration: 3000 }
            );
        }
    }

    onQuantityChanged(event: { productId: number; quantity: number }): void {
        this.cartService.updateQuantity(event.productId, event.quantity);
    }

    private calculateTotals(): void {
        const cart = this.cartService.getCartWithTotals();
        this.subtotal = cart.total;
        this.total = cart.total;
        this.itemCount = cart.itemCount;
    }
}
