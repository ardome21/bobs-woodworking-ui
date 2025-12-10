import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-edit-products',
    imports: [RouterModule, MatButtonModule, MatCheckboxModule, MatCardModule],
    templateUrl: './edit-products.html',
    styleUrl: './edit-products.scss',
})
export class EditProducts {
    @Input() products: Product[] = [];
    selectedProducts = new Set<string | number>();

    toggleSelection(productId: string | number): void {
        if (this.selectedProducts.has(productId)) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.add(productId);
        }
    }

    deleteProduct(productId: string | number): void {
        console.log('Deleting product:', productId);
        // TODO: Implement actual delete logic here
    }

    deleteSelected(): void {
        console.log('Deleting products:', Array.from(this.selectedProducts));
        // TODO: Implement actual bulk delete logic here
        this.selectedProducts.clear();
    }
}
