import { inject, Injectable } from '@angular/core';
import { ProductsApi } from '../repository/services/products-api';
import { Product } from '../models/products';
import { map, Observable } from 'rxjs';
import { ProductsAdapter } from './adapters/products-adapter';
import { ProductData } from '../repository/types/products';
import { Form } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class Products {
    private productsApi = inject(ProductsApi);

    getProducts(): Observable<Product[]> {
        return this.productsApi
            .getProducts()
            .pipe(map((data) => ProductsAdapter.adaptMany(data.products)));
    }

    getProductById(id: number): Observable<Product> {
        return this.productsApi
            .getProductById(id)
            .pipe(map((data) => ProductsAdapter.adapt(data)));
    }

    addProduct(formData: FormData): Observable<any> {
        console.log('Products service - adding product:', formData);
        return this.productsApi.addProduct(formData);
    }
}
