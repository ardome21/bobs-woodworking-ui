import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersService } from '../../../services/orders';
import { Order } from '../../../models/order';
import { OrderList } from '../../presenters/order-list/order-list';

@Component({
    selector: 'app-order-history',
    imports: [OrderList, MatProgressSpinnerModule],
    templateUrl: './order-history.html',
    styleUrls: ['./order-history.scss'],
})
export class OrderHistory implements OnInit {
    orders: Order[] = [];
    isLoading: boolean = true;

    private ordersService = inject(OrdersService);
    private snackBar = inject(MatSnackBar);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.loadOrders();
    }

    private loadOrders(): void {
        this.ordersService.getUserOrders().subscribe({
            next: (orders) => {
                this.orders = orders.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading orders:', error);
                this.isLoading = false;
                this.cdr.detectChanges();
                this.snackBar.open(
                    'Failed to load orders. Please try again.',
                    'Close',
                    {
                        duration: 5000,
                    }
                );
            },
        });
    }
}
