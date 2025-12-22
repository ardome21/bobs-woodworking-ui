import { Injectable } from '@angular/core';
import { Product } from '../../models/products';
import { ProductData } from '../../repository/types/products';
@Injectable({
    providedIn: 'root',
})
export class ProductsAdapter {
    static adapt(data: ProductData): Product {
        return {
            id: data.id,
            name: data.title,
            price: data.price,
            quantity: data.quantity,
            imageUrls: data.images || [],
            description: data.description,
        };
    }

    static adaptMany(dataArray: ProductData[]): Product[] {
        return dataArray.map(this.adapt);
    }
}
