import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-products-list',
    imports: [RouterModule, MatCardModule, MatButtonModule],
    templateUrl: './products-list.html',
    styleUrls: ['./products-list.scss'],
})
export class ProductsList {
    @Input() products: Product[] = [];
}
