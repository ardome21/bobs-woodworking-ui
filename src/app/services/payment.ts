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
    private stripePromise: Promise<Stripe | null> | null = null;

    constructor(private ordersApi: OrdersApi) {
        // Stripe will be loaded on-demand
    }

    createPaymentIntent(amount: number): Observable<PaymentIntent> {
        return this.ordersApi.createPaymentIntent(amount);
    }

    async confirmCardPayment(clientSecret: string, cardElement: StripeCardElement): Promise<any> {
        const stripe = await this.getStripeInstance();
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

    /**
     * Reset the Stripe instance to force a fresh load
     * Call this when navigating to checkout to ensure clean state
     */
    resetStripe(): void {
        console.log('Resetting Stripe instance');
        this.stripePromise = null;
    }

    async getStripeInstance(): Promise<Stripe | null> {
        // Load Stripe fresh if not already loaded or if reset
        if (!this.stripePromise) {
            console.log('Loading fresh Stripe instance');
            this.stripePromise = loadStripe(environment.stripePublishableKey);
        }
        return this.stripePromise;
    }
}
