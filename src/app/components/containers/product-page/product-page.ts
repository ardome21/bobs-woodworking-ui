import { Component, inject, OnInit, signal } from '@angular/core';
import { Products } from '../../../services/products';
import { Product } from '../../../models/products';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductDetails } from '../../presenters/product-details/product-details';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-product-page',
    imports: [CommonModule, RouterModule, ProductDetails, MatButtonModule],
    templateUrl: './product-page.html',
    styleUrls: ['./product-page.scss'],
})
export class ProductPage implements OnInit {
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
