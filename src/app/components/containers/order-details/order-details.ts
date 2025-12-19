import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersService } from '../../../services/orders';
import { Order } from '../../../models/order';
import { OrderDetailsPresenter } from '../../presenters/order-details/order-details';

@Component({
    selector: 'app-order-details',
    imports: [OrderDetailsPresenter, MatProgressSpinnerModule],
    templateUrl: './order-details.html',
    styleUrls: ['./order-details.scss'],
})
export class OrderDetails implements OnInit {
    order: Order | null = null;
    isLoading: boolean = true;

    private ordersService = inject(OrdersService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        const orderId = this.route.snapshot.paramMap.get('orderId');

        if (!orderId) {
            this.snackBar.open('No order ID provided', 'Close', {
                duration: 3000,
            });
            this.router.navigate(['/orders']);
            return;
        }

        this.loadOrder(orderId);
    }

    private loadOrder(orderId: string): void {
        this.ordersService.getOrderById(orderId).subscribe({
            next: (order) => {
                this.order = order;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading order:', error);
                this.isLoading = false;
                this.cdr.detectChanges();
                this.snackBar.open(
                    'Failed to load order details. Please try again.',
                    'Close',
                    {
                        duration: 5000,
                    }
                );
                this.router.navigate(['/orders']);
            },
        });
    }
}
