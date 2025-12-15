import { Component, inject, OnInit, signal } from '@angular/core';
import { Products } from '../../../services/products';
import { Product } from '../../../models/products';
import { ProductsList } from '../../presenters/products-list/products-list';
import { BrowseProducts } from '../browse-products/browse-products';
import { Test } from '../../../repository/services/test';

@Component({
    selector: 'app-home',
    imports: [ProductsList],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home implements OnInit {
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

    // For testing purposes
    private testAPI = inject(Test);
    testAuth() {
        this.testAPI.testTokenChecks().subscribe({
            next: (data) => {
                console.log('Test API response:', data);
            },
            error: (err) => {
                console.error('Error during test API call:', err);
            },
        });
    }
}
