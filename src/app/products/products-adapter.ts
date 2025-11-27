import { Injectable } from '@angular/core';
import { ProductData } from '../repository/types/products';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsAdapter {
  static adapt(data: ProductData): Product {
    return data;
  }

  static adaptMany(dataArray: ProductData[]): Product[] {
    return dataArray.map(this.adapt);
  }
}
