import { inject, Injectable } from '@angular/core';
import { ProductsApi } from '../repository/services/products-api';
import { Product } from '../models/products';
import { map, Observable } from 'rxjs';
import { ProductsAdapter } from './products-adapter';

@Injectable({
  providedIn: 'root',
})
export class Products {

  private productsApi = inject(ProductsApi)

  getProducts(): Observable<Product[]>{
    return this.productsApi.getProducts().pipe(
      map(data => ProductsAdapter.adaptMany(data))
    )
  }
}
