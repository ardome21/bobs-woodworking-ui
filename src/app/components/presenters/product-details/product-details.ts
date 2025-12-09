import { Component, Input } from '@angular/core';
import { Product } from '../../../models/products';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-product-details',
    imports: [MatCardModule],
    templateUrl: './product-details.html',
    styleUrls: ['./product-details.scss'],
})
export class ProductDetails {
    @Input() product: Product | null = null;
    @Input() editView: boolean = false;
}
