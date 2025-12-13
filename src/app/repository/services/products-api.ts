import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductData } from '../types/products';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProductsApi {
    private http = inject(HttpClient);

    baseUrl = environment.apiUrl;

    // FIXME: Switch with real URL
    private getProductsUrl = '/mock-data/products.json';
    private getProductByIdUrl = '/mock-data/product.json';

    getProducts(): Observable<ProductData[]> {
        return this.http.get<ProductData[]>(this.getProductsUrl);
    }

    getProductById(id: number): Observable<ProductData> {
        // FIXME: Use the id to fetch the correct product
        return this.http.get<ProductData>(this.getProductByIdUrl);
    }

    addProduct(formData: FormData): Observable<any> {
        console.log('ProductsApi - adding product:', formData);
        return this.http.post<any>(this.baseUrl + '/add-product', formData);
    }
}
