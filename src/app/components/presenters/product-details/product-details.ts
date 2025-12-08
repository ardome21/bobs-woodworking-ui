import { Component, Input } from '@angular/core';
import { Product } from '../../../models/products';

@Component({
    selector: 'app-product-details',
    imports: [],
    templateUrl: './product-details.html',
    styleUrls: ['./product-details.scss'],
})
export class ProductDetails {
    @Input() product: Product | null = null;

    @Input() editView: boolean = false;
}
