import { Routes } from '@angular/router';
import { Home } from './components/containers/home/home';
import { ProductPage } from './components/containers/product-page/product-page';

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
        path: '**',
        redirectTo: 'home',
    },
];
