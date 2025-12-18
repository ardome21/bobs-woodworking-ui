import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderRequest, CreateOrderResponse, PaymentIntent } from '../../models/order';
import { OrderData } from '../types/orders';

@Injectable({
    providedIn: 'root',
})
export class OrdersApi {
    private http = inject(HttpClient);

    baseUrl = environment.apiUrl;

    createPaymentIntent(amount: number): Observable<PaymentIntent> {
        return this.http.post<{ client_secret: string; payment_intent_id: string }>(
            `${this.baseUrl}/payment/create-intent`,
            { amount, currency: 'usd' }
        ).pipe(
            map(response => ({
                clientSecret: response.client_secret,
                paymentIntentId: response.payment_intent_id
            }))
        );
    }

    createOrder(orderData: CreateOrderRequest): Observable<CreateOrderResponse> {
        return this.http.post<{ order_id: string; total_amount: number; status: string; message: string }>(
            `${this.baseUrl}/orders`,
            orderData
        ).pipe(
            map(response => ({
                order_id: response.order_id,
                total_amount: response.total_amount,
                status: response.status,
                message: response.message
            }))
        );
    }

    getUserOrders(): Observable<{ orders: OrderData[] }> {
        return this.http.get<{ orders: OrderData[] }>(
            `${this.baseUrl}/orders`
        );
    }

    getOrderById(orderId: string): Observable<{ order: OrderData }> {
        return this.http.get<{ order: OrderData }>(
            `${this.baseUrl}/orders/${orderId}`
        );
    }
}
