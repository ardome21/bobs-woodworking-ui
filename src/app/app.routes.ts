import { Routes } from '@angular/router';
import { Home } from './components/containers/home/home';
import { ProductPage } from './components/containers/product-page/product-page';
import { ConfirmationSuccess } from './core/auth/components/confirmation-success/confirmation-success.component';

export const routes: Routes = [
    {
        path: 'home',
        component: Home,
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'product/:id',
        component: ProductPage,
    },
    {
        path: 'confirmation-success',
        component: ConfirmationSuccess,
        title: 'Confirmation Success',
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
