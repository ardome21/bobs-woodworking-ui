import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ProductsApi } from '../../../repository/services/products-api';
import { LoadingService } from '../../../services/loading.service';

@Component({
    selector: 'app-edit-products',
    imports: [RouterModule, MatButtonModule, MatCheckboxModule, MatCardModule],
    templateUrl: './edit-products.html',
    styleUrl: './edit-products.scss',
})
export class EditProducts {
    @Input() products: Product[] = [];
    @Output() productsDeleted = new EventEmitter<void>();
    selectedProducts = new Set<number>();

    private productsApi = inject(ProductsApi);
    private loadingService = inject(LoadingService);

    toggleSelection(productId: number): void {
        if (this.selectedProducts.has(productId)) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.add(productId);
        }
    }

    deleteProduct(productId: number): void {
        this.loadingService.setLoading('delete-single-product', true);
        this.productsApi.deleteProduct(productId).subscribe({
            next: (response) => {
                console.log('Product deleted:', response);
                this.loadingService.setLoading('delete-single-product', false);
                this.productsDeleted.emit();
            },
            error: (error) => {
                console.error('Error deleting product:', error);
                this.loadingService.setLoading('delete-single-product', false);
            },
        });
    }

    deleteSelected(): void {
        const productIds = Array.from(this.selectedProducts);
        this.loadingService.setLoading('delete-bulk-products', true);
        this.productsApi.deleteProducts(productIds).subscribe({
            next: (response) => {
                console.log('Products deleted:', response);
                this.selectedProducts.clear();
                this.loadingService.setLoading('delete-bulk-products', false);
                this.productsDeleted.emit();
            },
            error: (error) => {
                console.error('Error deleting products:', error);
                this.loadingService.setLoading('delete-bulk-products', false);
            },
        });
    }
}
