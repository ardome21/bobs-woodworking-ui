import { Component, inject, signal } from '@angular/core';
import { Product } from '../../../models/products';
import { Products } from '../../../services/products';
import { ProductsList } from '../../presenters/products-list/products-list';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-browse-products',
    imports: [ProductsList],
    templateUrl: './browse-products.html',
    styleUrl: './browse-products.scss',
})
export class BrowseProducts {
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
