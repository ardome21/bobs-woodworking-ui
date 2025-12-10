import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { Products } from '../../../services/products';
import { EditProducts } from '../../presenters/edit-products/edit-products';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-update-inventory',
    imports: [RouterModule, MatButtonModule, EditProducts, MatIconModule],
    templateUrl: './update-inventory.html',
    styleUrl: './update-inventory.scss',
})
export class UpdateInventory {
    products = signal<Product[]>([]);

    private productService = inject(Products);

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
}
