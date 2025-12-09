import { Routes } from '@angular/router';
import { Home } from './components/containers/home/home';
import { ProductPage } from './components/containers/product-page/product-page';
import { ConfirmationSuccess } from './core/auth/components/confirmation-success/confirmation-success.component';
import { BrowseProducts } from './components/containers/browse-products/browse-products';
import { UpdateInventory } from './components/containers/update-inventory/update-inventory';
import { AddInventory } from './components/containers/add-inventory/add-inventory';
import { EditProductPage } from './components/containers/edit-product-page/edit-product-page';

export const routes: Routes = [
    {
        path: 'home',
        title: 'Home',
        component: Home,
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'browse-products',
        title: 'Browse Products',
        component: BrowseProducts,
        pathMatch: 'full',
    },
    {
        path: 'update-inventory',
        title: 'Update Inventory',
        component: UpdateInventory,
        pathMatch: 'full',
    },
    {
        path: 'update-inventory/add',
        title: 'Add Inventory',
        pathMatch: 'full',
        component: AddInventory,
    },
    {
        path: 'product/:id',
        title: 'Product Details',
        component: ProductPage,
        pathMatch: 'full',
    },
    {
        path: 'product/:id/edit',
        title: 'Edit Product',
        component: EditProductPage,
        pathMatch: 'full',
    },
    {
        path: 'confirmation-success',
        title: 'Confirmation Success',
        component: ConfirmationSuccess,
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
