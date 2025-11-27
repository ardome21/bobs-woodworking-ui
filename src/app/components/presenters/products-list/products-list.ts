import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/products';

@Component({
  selector: 'app-products-list',
  imports: [RouterModule],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.scss'],
})
export class ProductsList {

  @Input() products: Product[] = [];

}
