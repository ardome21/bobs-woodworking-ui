import { Component, inject, OnInit, signal } from '@angular/core';
import { Products } from '../products/products';
import { Product } from '../models/products';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  products = signal<Product[]>([])

  private productService = inject(Products)

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }
}
