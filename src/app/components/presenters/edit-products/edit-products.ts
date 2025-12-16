import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-edit-products',
    imports: [RouterModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatIconModule],
    templateUrl: './edit-products.html',
    styleUrl: './edit-products.scss',
})
export class EditProducts {
    @Input() products: Product[] = [];
    @Output() deleteProduct = new EventEmitter<number>();
    @Output() deleteSelectedProducts = new EventEmitter<number[]>();

    selectedProducts = new Set<number>();
    currentImageIndices: Map<number, number> = new Map();

    toggleSelection(productId: number): void {
        if (this.selectedProducts.has(productId)) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.add(productId);
        }
    }

    onDeleteProduct(productId: number): void {
        this.deleteProduct.emit(productId);
    }

    onDeleteSelected(): void {
        const productIds = Array.from(this.selectedProducts);
        this.deleteSelectedProducts.emit(productIds);
        this.selectedProducts.clear();
    }

    getCurrentImageIndex(productId: number): number {
        return this.currentImageIndices.get(productId) || 0;
    }

    getCurrentImageUrl(product: Product): string {
        const index = this.getCurrentImageIndex(product.id);
        return product.imageUrls[index] || '';
    }

    hasMultipleImages(product: Product): boolean {
        return product.imageUrls.length > 1;
    }

    previousImage(productId: number, product: Product, event: Event): void {
        event.stopPropagation();
        const currentIndex = this.getCurrentImageIndex(productId);
        const newIndex = currentIndex === 0 ? product.imageUrls.length - 1 : currentIndex - 1;
        this.currentImageIndices.set(productId, newIndex);
    }

    nextImage(productId: number, product: Product, event: Event): void {
        event.stopPropagation();
        const currentIndex = this.getCurrentImageIndex(productId);
        const newIndex = (currentIndex + 1) % product.imageUrls.length;
        this.currentImageIndices.set(productId, newIndex);
    }
}
