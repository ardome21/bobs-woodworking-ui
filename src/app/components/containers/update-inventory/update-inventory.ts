import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { Products } from '../../../services/products';
import { EditProducts } from '../../presenters/edit-products/edit-products';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../../../services/loading.service';

@Component({
    selector: 'app-update-inventory',
    imports: [RouterModule, MatButtonModule, EditProducts, MatIconModule],
    templateUrl: './update-inventory.html',
    styleUrl: './update-inventory.scss',
})
export class UpdateInventory {
    products = signal<Product[]>([]);

    private productService = inject(Products);
    private loadingService = inject(LoadingService);

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.productService.getProducts().subscribe({
            next: (data) => {
                this.products.set(data);
            },
            error: (err) => {
                console.error('Error loading products:', err);
            },
        });
    }

    onDeleteProduct(productId: number): void {
        this.loadingService.setLoading('delete-single-product', true);
        this.productService.deleteProduct(productId).subscribe({
            next: (response) => {
                console.log('Product deleted:', response);
                this.loadingService.setLoading('delete-single-product', false);
                this.loadProducts();
            },
            error: (error) => {
                console.error('Error deleting product:', error);
                this.loadingService.setLoading('delete-single-product', false);
            },
        });
    }

    onDeleteSelectedProducts(productIds: number[]): void {
        this.loadingService.setLoading('delete-bulk-products', true);
        this.productService.deleteProducts(productIds).subscribe({
            next: (response) => {
                console.log('Products deleted:', response);
                this.loadingService.setLoading('delete-bulk-products', false);
                this.loadProducts();
            },
            error: (error) => {
                console.error('Error deleting products:', error);
                this.loadingService.setLoading('delete-bulk-products', false);
            },
        });
    }
}
