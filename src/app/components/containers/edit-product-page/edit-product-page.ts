import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { Products } from '../../../services/products';
import { ProductDetails } from '../../presenters/product-details/product-details';
import { MatAnchor } from '@angular/material/button';

@Component({
    selector: 'app-edit-product-page',
    imports: [ProductDetails, RouterModule, MatAnchor],
    templateUrl: './edit-product-page.html',
    styleUrl: './edit-product-page.scss',
})
export class EditProductPage {
    public product = signal<Product | null>(null);

    private route = inject(ActivatedRoute);
    private productService = inject(Products);

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
}
