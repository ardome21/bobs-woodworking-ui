import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OrdersApi } from '../repository/services/orders-api';
import { OrdersAdapter } from './adapters/orders-adapter';
import { Order, CreateOrderRequest } from '../models/order';
import { CartItem } from '../models/cart';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    private ordersApi = inject(OrdersApi);

    createOrder(
        cartItems: CartItem[],
        shippingAddress: {
            name: string;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        },
        paymentIntentId: string
    ): Observable<{ orderId: string; totalAmount: number; status: string }> {
        const orderRequest: CreateOrderRequest = {
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            })),
            shipping_address: shippingAddress,
            payment_intent_id: paymentIntentId
        };

        return this.ordersApi.createOrder(orderRequest).pipe(
            map(response => ({
                orderId: response.order_id,
                totalAmount: response.total_amount,
                status: response.status
            }))
        );
    }

    getUserOrders(): Observable<Order[]> {
        return this.ordersApi.getUserOrders().pipe(
            map(response => OrdersAdapter.adaptMany(response.orders))
        );
    }

    getOrderById(orderId: string): Observable<Order> {
        return this.ordersApi.getOrderById(orderId).pipe(
            map(response => OrdersAdapter.adapt(response.order))
        );
    }
}
