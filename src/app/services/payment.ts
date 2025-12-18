import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { Observable, from, map } from 'rxjs';
import { PaymentIntent } from '../models/order';
import { OrdersApi } from '../repository/services/orders-api';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private stripePromise: Promise<Stripe | null>;

    constructor(private ordersApi: OrdersApi) {
        this.stripePromise = loadStripe(environment.stripePublishableKey);
    }

    createPaymentIntent(amount: number): Observable<PaymentIntent> {
        return this.ordersApi.createPaymentIntent(amount);
    }

    async confirmCardPayment(clientSecret: string, cardElement: StripeCardElement): Promise<any> {
        const stripe = await this.stripePromise;
        if (!stripe) {
            throw new Error('Stripe failed to load');
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            }
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result.paymentIntent;
    }

    async getStripeInstance(): Promise<Stripe | null> {
        return this.stripePromise;
    }
}
