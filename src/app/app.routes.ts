import { Routes } from '@angular/router';
import { Home } from './components/containers/home/home';
import { ProductPage } from './components/containers/product-page/product-page';
import { ConfirmationSuccess } from './core/auth/components/confirmation-success/confirmation-success.component';
import { BrowseProducts } from './components/containers/browse-products/browse-products';
import { UpdateInventory } from './components/containers/update-inventory/update-inventory';
import { AddInventory } from './components/containers/add-inventory/add-inventory';
import { EditProductPage } from './components/containers/edit-product-page/edit-product-page';
import { Cart } from './components/containers/cart/cart';
import { Checkout } from './components/containers/checkout/checkout';
import { OrderConfirmation } from './components/containers/order-confirmation/order-confirmation';
import { OrderHistory } from './components/containers/order-history/order-history';
import { OrderDetails } from './components/containers/order-details/order-details';
import { adminGuard, authGuard } from './core/auth/services/auth.guard';

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
        children: [
            {
                path: '',
                title: 'Browse Products',
                component: BrowseProducts,
                pathMatch: 'full',
            },
            {
                path: 'product/:id',
                title: 'Product Details',
                component: ProductPage,
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'cart',
        title: 'Shopping Cart',
        component: Cart,
        pathMatch: 'full',
    },
    {
        path: 'checkout',
        title: 'Checkout',
        component: Checkout,
        pathMatch: 'full',
    },
    {
        path: 'order-confirmation/:orderId',
        title: 'Order Confirmation',
        component: OrderConfirmation,
        pathMatch: 'full',
    },
    {
        path: 'orders',
        title: 'My Orders',
        component: OrderHistory,
        canActivate: [authGuard],
        pathMatch: 'full',
    },
    {
        path: 'orders/:orderId',
        title: 'Order Details',
        component: OrderDetails,
        canActivate: [authGuard],
        pathMatch: 'full',
    },
    {
        path: 'update-inventory',
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                title: 'Update Inventory',
                pathMatch: 'full',
                component: UpdateInventory,
            },
            {
                path: 'add',
                title: 'Add Inventory',
                pathMatch: 'full',
                component: AddInventory,
            },
            {
                path: 'edit/:id',
                title: 'Edit Product',
                component: EditProductPage,
                pathMatch: 'full',
            },
        ],
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
