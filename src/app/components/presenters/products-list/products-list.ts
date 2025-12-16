import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-products-list',
    imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './products-list.html',
    styleUrls: ['./products-list.scss'],
})
export class ProductsList {
    @Input() products: Product[] = [];
    currentImageIndices: Map<number, number> = new Map();

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
