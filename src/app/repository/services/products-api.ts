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

    getProducts(): Observable<{
        products: ProductData[];
    }> {
        return this.http.get<{
            products: ProductData[];
        }>(this.baseUrl + '/products');
    }

    getProductById(id: number): Observable<{ product: ProductData }> {
        return this.http.get<{
            product: ProductData;
        }>(`${this.baseUrl}/products/${id}`);
    }

    addProduct(formData: FormData): Observable<any> {
        console.log('ProductsApi - adding product:', formData);
        return this.http.post<{
            message: string;
            product: ProductData;
        }>(this.baseUrl + '/products', formData);
    }

    updateProduct(
        productId: number,
        formData: FormData
    ): Observable<{ message: string; product: ProductData }> {
        return this.http.put<{ message: string; product: ProductData }>(
            `${this.baseUrl}/products/${productId}`,
            formData
        );
    }

    deleteProduct(productId: number): Observable<any> {
        return this.http.delete<{ message: string }>(
            `${this.baseUrl}/products/${productId}`
        );
    }

    deleteProducts(productIds: number[]): Observable<any> {
        return this.http.delete<{ message: string }>(
            this.baseUrl + '/products',
            {
                body: { product_ids: productIds },
            }
        );
    }
}
