import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { Products } from '../../../services/products';
import { Product } from '../../../models/products';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductDetails } from '../../presenters/product-details/product-details';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../../services/cart';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-product-page',
    imports: [CommonModule, RouterModule, ProductDetails, MatButtonModule],
    templateUrl: './product-page.html',
    styleUrls: ['./product-page.scss'],
})
export class ProductPage implements OnInit {
    public product = signal<Product | null>(null);

    private route = inject(ActivatedRoute);
    private productService = inject(Products);
    private cartService = inject(CartService);
    private snackBar = inject(MatSnackBar);

    // Convert cart observable to signal
    private cartItems = toSignal(this.cartService.cart$, { initialValue: [] });

    // Computed signal that checks if current product is in cart
    public isInCart = computed(() => {
        const currentProduct = this.product();
        const items = this.cartItems();

        if (!currentProduct) return false;

        return items.some(item => item.product_id === currentProduct.id);
    });

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!isNaN(id)) {
            this.loadProductInfo(id);
        } else {
            console.error('Invalid product ID');
        }
    }

    loadProductInfo(id: number) {
        this.productService.getProductById(id).subscribe({
            next: (data) => {
                this.product.set(data);
            },
            error: (err) => {
                console.error('Error loading products:', err);
            },
        });
    }

    onAddedToCart(event: { product: Product; quantity: number }): void {
        const wasAdded = this.cartService.addToCart(event.product, event.quantity);

        if (wasAdded) {
            this.snackBar.open(
                `Added ${event.product.name} to cart`,
                'Close',
                {
                    duration: 3000,
                    panelClass: 'snackbar-success'
                }
            );
        }
    }

    onRemovedFromCart(productId: number): void {
        const productName = this.product()?.name || 'Item';
        this.cartService.removeFromCart(productId);

        this.snackBar.open(
            `Removed ${productName} from cart`,
            'Close',
            {
                duration: 3000
            }
        );
    }
}
