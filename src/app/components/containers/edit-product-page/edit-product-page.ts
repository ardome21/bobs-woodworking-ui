import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { Products } from '../../../services/products';
import {
    ProductDetails,
    ProductUpdateData,
} from '../../presenters/product-details/product-details';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../../services/loading.service';

@Component({
    selector: 'app-edit-product-page',
    imports: [ProductDetails, RouterModule, MatButtonModule],
    templateUrl: './edit-product-page.html',
    styleUrl: './edit-product-page.scss',
})
export class EditProductPage {
    public product = signal<Product | null>(null);
    public isSaving = computed(() =>
        this.loadingService.isLoadingKey('product-save')
    );

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(Products);
    private loadingService = inject(LoadingService);

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!isNaN(id)) this.loadProductInfo(id);
        else {
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

    onProductUpdated(data: ProductUpdateData): void {
        this.loadingService.setLoading('product-save', true);

        this.productService.updateProduct(data.id, data.formData).subscribe({
            next: (updatedProduct) => {
                console.log('Product updated:', updatedProduct);
                // Fetch fresh product data with new presigned URLs
                this.loadProductInfo(data.id);
                this.loadingService.setLoading('product-save', false);
            },
            error: (error) => {
                console.error('Error updating product:', error);
                this.loadingService.setLoading('product-save', false);
            },
        });
    }

    onProductDeleted(id: number): void {
        this.loadingService.setLoading('product-delete', true);
        this.productService.deleteProduct(id).subscribe({
            next: (response) => {
                console.log('Product deleted:', response);
                this.loadingService.setLoading('product-delete', false);
                this.router.navigate(['/update-inventory']);
            },
            error: (error) => {
                console.error('Error deleting product:', error);
                this.loadingService.setLoading('product-delete', false);
            },
        });
    }
}
